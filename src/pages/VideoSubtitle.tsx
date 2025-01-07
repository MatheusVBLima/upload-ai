import { Separator } from "@radix-ui/react-separator";
import { Download, FileVideo, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
//
import { api } from "@/lib/axios";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Button } from "../components/ui/button";

type Status = "waiting" | "converting" | "uploading" | "generating" | "success";

const statusMessages = {
  converting: "Convertendo...",
  generating: "Transcrevendo...",
  uploading: "Carregando...",
  success: "Sucesso!",
};

interface VideoSubtitleProps {
  onVideoUploaded?: (videoId: string) => void;
}

export function VideoSubtitle(props: VideoSubtitleProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const [transcription, setTranscription] = useState<string | null>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  async function convertVideoToAudio(video: File) {
    const ffmepg = await getFFmpeg();

    await ffmepg.writeFile("input.mp4", await fetchFile(video));

    ffmepg.on("progress", (progress) => {
      console.log(`progress: ${Math.round(progress.progress * 100)}`);
    });

    await ffmepg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmepg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    return audioFile;
  }
  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!videoFile) {
      return;
    }

    setStatus("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append("file", audioFile);

    setStatus("uploading");

    const response = await api.post("/videos", data);

    const videoId = response.data.video.id;

    setStatus("generating");

    try {
      const transcriptionResponse = await api.post(
        `/videos/${videoId}/transcription`,
        {
          prompt: '',
        }
      );

      setStatus("success");
      setTranscription(transcriptionResponse.data);
      
      if (props.onVideoUploaded) {
        props.onVideoUploaded(videoId);
      }
    } catch (error) {
      console.error("Erro na transcrição:", error);
      setStatus("waiting");
      alert("Erro ao gerar a transcrição. Por favor, tente novamente.");
    }
  }

  function handleDownload(text: string) {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcricao.txt";
    document.body.appendChild(element);
    element.click();
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <main className="container flex flex-col items-center justify-center gap-8 mt-6">
      <h1 className="text-xl font-semibold text-center">
        Upload a video up to 50mb, click "Upload Video" and download everything
        said in the video!

      </h1>
      <form onSubmit={handleUploadVideo} className="space-y-6">
        <label
          htmlFor="video"
          className="relative flex flex-col items-center justify-center gap-2 p-4 text-sm transition-colors duration-200 border border-dashed rounded-md cursor-pointer aspect-video text-muted-foreground hover:bg-primary hover:text-secondary"
        >
          {videoFile ? (
            <video
              src={previewURL ?? ""}
              className="absolute inset-0 object-cover w-full h-full rounded-md pointer-events-none"
              controls={false}
            />
          ) : (
            <>
              <FileVideo className="w-4 h-4" />
              Select a video
            </>
          )}
        </label>
        <input
          type="file"
          id="video"
          accept="video/mp4"
          className="sr-only"
          onChange={handleFileSelected}
        />
        <Separator />
        <Button
          data-success={status === "success"}
          disabled={status != "waiting"}
          className="w-full data-[success=true]:bg-emerald-400"
          type="submit"

          
        >
          {status === "waiting" ? (
            <>
              Upload Video
              <Upload className="w-4 h-4 ml-2" />
            </>
          ) : (
            statusMessages[status]
          )}
        </Button>
        <Button
          onClick={() => handleDownload(transcription ?? "")}
          data-success={status === "success"}
          disabled={status !== "success"}
          className="w-full data-[success=true]:bg-emerald-400"
          type="button"
          newData-success={status === "success"}
        >
          Download Transcription
          <Download className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </main>
  );
}

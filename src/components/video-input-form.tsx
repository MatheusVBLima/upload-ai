import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-separator";
import { FileVideo, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status = "waiting" | "converting" | "uploading" | "generating" | "success";

const statusMessages = {
  converting: "Convertendo...",
  generating: "Transcrevendo...",
  uploading: "Carregando...",
  success: "Sucesso!",
};

interface VideoInputFormProps {
  onVideoUploaded: (videoId: string) => void;
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [, setTranscription] = useState<string | null>(null);

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

    const prompt = promptInputRef.current?.value;

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

    const transcriptionResponse = await api.post(
      `/videos/${videoId}/transcription`,
      {
        prompt,
      }
    );

    setStatus("success");

    setTranscription(transcriptionResponse.data);

    props.onVideoUploaded(videoId);
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <div>
      <form onSubmit={handleUploadVideo} className="space-y-6">
        <label
          htmlFor="video"
          className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary hover:text-secondary transition-colors duration-200 p-4"
        >
          {videoFile ? (
            <video
              src={previewURL ?? ""}
              className="pointer-events-none absolute inset-0 w-full h-full object-cover rounded-md"
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

        <div className="space-y-2">
          <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
          <Textarea
            disabled={status != "waiting"}
            ref={promptInputRef}
            id="transcription_prompt"
            placeholder="Inclua palavras chave mencionadas no vídeo e separadas por vírgula"
            className="min-h-20 leading-relaxed resize-none"
          />
        </div>
        <Button
          data-success={status === "success"}
          disabled={status != "waiting"}
          className="w-full data-[success=true]:bg-emerald-400"
          type="submit"
        >
          {status === "waiting" ? (
            <>
              Carregar Vídeo
              <Upload className="w-4 h-4 ml-2" />
            </>
          ) : (
            statusMessages[status]
          )}
        </Button>
      </form>
    </div>
  );
}

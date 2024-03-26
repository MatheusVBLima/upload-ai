import { Separator } from "@radix-ui/react-separator";
import { Upload, Download } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

import { Button } from "../components/ui/button";
import { api } from "@/lib/axios";

type Status = "waiting" | "uploading" | "success" | "error";

const statusMessages = {
  uploading: "Carregando...",
  success: "Sucesso!",
  error: "Erro ao processar o texto.",
};

export function TextSpeech() {
  const [textFile, setTextFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  /* const promptInputRef = useRef<HTMLTextAreaElement>(null); */
  const [audio, setAudio] = useState<string | null>(null);

  async function handleUploadText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /* const prompt = promptInputRef.current?.value; */

    if (!textFile) {
      return;
    }

    setStatus("uploading");

    const data = new FormData();
    data.append("file", textFile);
    /* data.append("prompt", prompt || ""); */

    try {
      const response = await api.post("/texts", data);

      const { speechFile } = response.data;
      setAudio(speechFile);
      setStatus("success");
    } catch (error) {
      console.error("Error uploading text:", error);
      setStatus("error");
    }
  }

  async function handleDownloadAudio() {
    if (!audio) {
      return;
    }

    const fileName = audio.startsWith("\\") ? audio.slice(1) : audio;

    const fullAudioUrl = `${window.location.origin}/audio?file=${fileName}`;

    const link = document.createElement("a");
    link.href = fullAudioUrl;
    link.download = "audio.mp3";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  function handleFileSelectedText(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];

    setTextFile(selectedFile);
  }

  return (
    <main className="container mt-6 flex flex-col items-center justify-center gap-8">
      <h1 className="font-semibold text-xl">
        Selecione um aquivo .txt, clique em "Carregar Texto" e faça o download
        de um arquivo mp3 com uma IA lendo tudo o que foi escrito!
      </h1>
      <form onSubmit={handleUploadText} className="space-y-6">
        <label
          htmlFor="text"
          className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary hover:text-secondary transition-colors duration-200 p-4"
        >
          {textFile ? (
            <div className="pointer-events-none absolute inset-0 w-full h-full object-cover rounded-md">
              {/* Visualização do texto (se necessário) */}
            </div>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Selecionar Arquivo de Texto
            </>
          )}
        </label>
        <input
          type="file"
          id="text"
          accept=".txt"
          className="sr-only"
          onChange={handleFileSelectedText}
        />
        <Separator />
        <Button
          disabled={status !== "waiting"}
          className="w-full"
          type="submit"
        >
          {status === "waiting" ? "Carregar Texto" : statusMessages[status]}
        </Button>

        <Button
          onClick={handleDownloadAudio}
          disabled={status !== "success" || !audio}
          className="w-full data-[success=true]:bg-emerald-400"
          type="button"
        >
          Download do Áudio
          <Download className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </main>
  );
}

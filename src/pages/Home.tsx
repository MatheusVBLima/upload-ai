import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="flex flex-col items-center gap-20 container">
      <h1 className="mt-16 text-3xl">Bem Vindo</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 ">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Transcrição de vídeo</CardTitle>
            <CardDescription className="text-justify">
              Envie um vídeo e receba sua transcrição
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center flex-1 pb-2">
            <Button asChild className="mt-auto">
              <Link to={"subtitle"}>Acessar</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Título e Descrição</CardTitle>
            <CardDescription className="text-justify">
              Envie um vídeo e receba sugestões de título e descrição de acordo com seu conteúdo
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center flex-1 pb-2">
            <Button asChild className="mt-auto">
              <Link to={"titledescription"}>Acessar</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Em Breve</CardTitle>
            <CardDescription className="text-justify">
              Você poderá enviar um texto e receber um áudio com a leitura dele
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center flex-1 pb-2 ">
            <Button disabled={true} className="mt-auto"> 
              <Link to={"textspeech"} >Acessar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

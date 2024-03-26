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
    <main className="flex flex-col items-center gap-20">
      <h1 className="mt-16 text-3xl">Bem Vindo</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 ">
        <Card>
          <CardHeader>
            <CardTitle>Transcrição de vídeo</CardTitle>
            <CardDescription>
              Envie um vídeo e receba sua transcrição
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to={"subtitle"}>Acessar</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Título e Descrição</CardTitle>
            <CardDescription>
              Envie um vídeo e receba sugestões de título e descrição de acordo com seu conteúdo
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to={"titledescription"}>Acessar</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Em Breve</CardTitle>
            <CardDescription>
              Você poderá enviar um texto e receber um áudio com a leitura dele
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button disabled={true}> 
              <Link to={"textspeech"} >Acessar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

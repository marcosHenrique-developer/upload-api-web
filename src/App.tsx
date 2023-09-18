import { Github, Moon, SunMoon, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Slider } from "./components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { VideoInputForm } from "./components/video-input-form";
import { PromptSelect } from "./components/prompt-input-form";
import { useState } from "react";
import { useCompletion } from "ai/react";
import { Switch } from "./components/ui/switch";
import { darkTheme, lightTheme } from "./theme";

export function App() {
  const [lightMode, setLightMode] = useState(false);
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  function setVariables(vars: object) {
    const root = window.document.documentElement;
    Object.entries(vars).forEach((v) => root?.style.setProperty(v[0], v[1]));
  }

  function onChangeValue(value: boolean) {
    setLightMode(value);

    if (!lightMode) {
      setVariables(lightTheme);
    } else {
      setVariables(darkTheme);
    }
  }

  function goGitHub() {
    window.location.href =
      "https://github.com/marcosHenrique-developer/upload-api-web";
  }

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "http://localhost:3333/ai/complete",
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Upload AI</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 😍💜
          </span>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center space-x-2">
            <Switch
              id={lightMode ? "light-mode" : "dark-mode"}
              onCheckedChange={onChangeValue}
            />
            {lightMode ? (
              <Label htmlFor="light-mode">
                <SunMoon className="w-4 h-4 mr-2" />
              </Label>
            ) : (
              <Label htmlFor="dark-mode">
                <Moon className="w-4 h-4 mr-2" />
              </Label>
            )}
          </div>

          <Button variant="outline" onClick={goGitHub}>
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="Inclua a Prompt na IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              value={completion}
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{" "}
            <code className="text-violet-400">transcription</code> no seu prompt
            para adicionar o conteudo da transcrição do video selecionado.
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Promt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16K</SelectItem>
                </SelectContent>
              </Select>

              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa seção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura </Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />

              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo e
                com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}

import { useCompletion } from "ai/react";
import React, { createContext, useState } from "react";

interface ContextProps {
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  videoId: string | null;
  setVideoId: React.Dispatch<React.SetStateAction<string | null>>;

  completion: any; 
  isLoading: boolean;
}

interface ContextProviderProps {
  children: React.ReactNode;
}

export const Context = createContext({} as ContextProps);

export function ContextProvider({ children }: ContextProviderProps) {
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  const { completion, isLoading } = useCompletion({
    api: "http://localhost:3333/ai/complete",
    body: {
      videoId,
      temperature: 0.5,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <Context.Provider
      value={{
        temperature,
        setTemperature,
        videoId,
        setVideoId,

        completion,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}

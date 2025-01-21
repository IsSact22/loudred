"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useData } from "../hooks/useData";

export default function MusicPlayer() {
  // Estado para la lista completa de canciones
  const { data = [], error, isLoading } = useData("/songs");
  const songs = data.songs ?? [];
  // Estado para el índice de la canción actual
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  // Estados para controlar la reproducción
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // Efecto para configurar listeners cuando cambie la fuente del <audio>
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
    };
  }, [audioRef.current]);

  // Funciones de manejo de eventos de audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Función de formato para el tiempo reproducido
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Reproducir / Pausar
  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  // Avanzar en la barra de reproducción
  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // Funciones para "SkipBack" y "SkipForward"
  // Aquí podrías personalizar la lógica, por ejemplo:
  // - Cambiar de canción
  // - Adelantar x segundos, etc.
  const handleSkipBack = () => {
    // Si solo quieres cambiar de canción:
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleSkipForward = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Si aún no se han cargado canciones o el array está vacío, mostramos algo
  if (songs.length === 0) {
    return <div className="m-4">Cargando canciones...</div>;
  }

  // Tomamos la canción actual (basada en currentSongIndex)
  const currentSong = songs[currentSongIndex];

  return (
    <div className="w-full max-w-sm mx-auto bg-white/40 rounded-lg shadow-sm overflow-hidden md:max-w-xl mt-8">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="h-24 w-full object-cover md:h-full md:w-24"
            src={currentSong.image ?? "/placeholder.svg"}
            alt={currentSong.title}
          />
        </div>
        <div className="p-4 w-full">
          <div className="uppercase tracking-wide text-xs text-indigo-500 font-semibold">
            {currentSong.categoryName ?? "Desconocido"}
          </div>
          <a
            href="#"
            className="block mt-1 text-base leading-tight font-medium text-black hover:underline"
          >
            {currentSong.title}
          </a>

          {/* Barra de reproducción (Slider) */}
          <div className="mt-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controles de reproducción */}
          <div className="mt-2 flex justify-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleSkipBack}>
              <SkipBack className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="icon" onClick={togglePlayPause}>
              {isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleSkipForward}>
              <SkipForward className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.music} />
    </div>
  );
}

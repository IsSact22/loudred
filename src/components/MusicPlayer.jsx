"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useData } from "../hooks/useData";

export default function MusicPlayer() {
  const { data = [], error, isLoading } = useData("/songs");
  const songs = data.songs ?? [];
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleSkipBack = () => {
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

  if (songs.length === 0) {
    return <div className="m-4">Cargando canciones...</div>;
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className="w-full max-w-[18rem] mx-auto bg-slate-950/80 rounded-lg shadow-sm overflow-hidden mt-10">
      <img
        className="w-full h-56 object-cover"
        src={currentSong.image ?? "/placeholder.svg"}
        alt={currentSong.title}
      />
      <div className="p-3">
        <div className="uppercase tracking-wide text-xs text-red-500 font-semibold">
          {currentSong.categoryName ?? "Desconocido"}
        </div>
        <div className="mt-1 text-sm font-medium text-white truncate">
          {currentSong.title}
        </div>

        {/* Barra de reproducción */}
        <div className="mt-3">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="w-full h-1"
          />
          <div className="flex justify-between text-xs mt-1 text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controles */}
        <div className="mt-3 flex justify-center space-x-1">
          <Button variant="outline" size="icon" className="p-1" onClick={handleSkipBack}>
            <SkipBack className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="p-1" onClick={togglePlayPause}>
            {isPlaying ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
          <Button variant="outline" size="icon" className="p-1" onClick={handleSkipForward}>
            <SkipForward className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.music} />
    </div>
  );
}

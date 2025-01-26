"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "../stores/usePlayerStore";

export default function MusicPlayer() {
  const { currentSong, isPlaying, setIsPlaying, playSong, currentPlaylist } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleSongEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("ended", handleSongEnd);
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

  const handleSongEnd = () => {
    handleSkipForward(); // Avanzar a la siguiente canción cuando termine
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
      setIsPlaying(!isPlaying); // Actualiza el estado de reproducción en Zustand
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
    const prevIndex = currentPlaylist.indexOf(currentSong);
    const newIndex = prevIndex === 0 ? currentPlaylist.length - 1 : prevIndex - 1;
    const newSong = currentPlaylist[newIndex];
    playSong(newSong, currentPlaylist);
    setCurrentTime(0);
  };

  const handleSkipForward = () => {
    const nextIndex = (currentPlaylist.indexOf(currentSong) + 1) % currentPlaylist.length;
    const newSong = currentPlaylist[nextIndex];
    playSong(newSong, currentPlaylist);
    setCurrentTime(0);
  };

  if (!currentSong) {
    return <div className="m-4">Cargando canción...</div>;
  }

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
            className="w-full h-1 bg-red-300"
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
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <Button variant="outline" size="icon" className="p-1" onClick={handleSkipForward}>
            <SkipForward className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.music} autoPlay />
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { usePlayerStore, usePlayerActions } from "@/src/stores/playerStore";
import { toast } from "react-hot-toast";

export function useMusicPlayer() {
  // Estados del store
  const { currentSong, isPlaying, isShuffled } = usePlayerStore();
  const { handleSkipForward, handleSkipBack, toggleShuffle, setPlayingState } =
    usePlayerActions();

  // Estados locales
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Manejador optimizado de tiempo
  const handleTimeUpdate = useCallback(() => {
    const newTime = audioRef.current?.currentTime || 0;
    setCurrentTime((prev) =>
      Math.abs(newTime - prev) >= 0.1 ? newTime : prev
    );
  }, []);

  // Efecto principal de control de audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const handleLoadedData = () => {
      setDuration(audio.duration);
      if (isPlaying) audio.play().catch(console.error);
    };

    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", () => {
      setCurrentTime(0);
      handleSkipForward();
    });

    // Cargar nueva fuente
    audio.src = currentSong.music;
    audio.load();

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentSong?.id, handleTimeUpdate, handleSkipForward]); // Eliminado isPlaying

  // Control de reproducción
  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await audioRef.current?.pause();
        setPlayingState(false);
      } else {
        await audioRef.current?.play();
        setPlayingState(true);
      }
    } catch (error) {
      toast.error("Error al controlar la reproducción");
      setPlayingState(false);
    }
  };

  // Control de shuffle con feedback
  const handleToggleShuffle = () => {
    toggleShuffle();
    toast.success(
      isShuffled
        ? "Reproducción en orden activada"
        : "Reproducción aleatoria activada",
      { position: "bottom-center" }
    );
  };

  // Formateo de tiempo
  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, []);

  // Control de la barra de progreso
  const handleSeek = (values) => {
    if (audioRef.current) {
      audioRef.current.currentTime = values[0];
      setCurrentTime(values[0]);
    }
  };

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    audioRef,
    togglePlayPause,
    handleSkipBack,
    handleSkipForward,
    handleToggleShuffle,
    formatTime,
    handleSeek,
    isShuffled,
  };
}

import { useState, useEffect, useRef, useCallback } from "react";
import { usePlayerStore, usePlayerActions } from "@/src/stores/playerStore";
import { toast } from "react-hot-toast";

export function useMusicPlayer() {
  // Estados del store
  const {
    currentSong,
    isPlaying,
    currentPlaylist,
    isShuffled,
    shuffledPlaylist,
    playedIndices,
  } = usePlayerStore();

  // Acciones del store
  const { playSong, toggleShuffle, handleSongEnd, setPlayingState } =
    usePlayerActions();

  // Estados locales del componente
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Manejador optimizado de actualización de tiempo
  const handleTimeUpdate = useCallback(() => {
    const newTime = audioRef.current?.currentTime || 0;
    if (Math.abs(newTime - currentTime) >= 0.1) {
      setCurrentTime(newTime);
    }
  }, [currentTime]);

  // Manejador del fin de canción
  const handleSongEndCallback = useCallback(() => {
    handleSongEnd();
    setCurrentTime(0);
  }, [handleSongEnd]);

  // Efectos para control del audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleSongEndCallback);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleSongEndCallback);
    };
  }, [handleTimeUpdate, handleSongEndCallback]);

  useEffect(() => {
    if (currentSong && isPlaying && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir:", error);
        setPlayingState(false);
      });
    }
  }, [currentSong, isPlaying, setPlayingState]);

  // Control play/pause
  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setPlayingState(false); // Usamos la acción del store
      } else {
        await audioRef.current.play();
        setPlayingState(true); // Usamos la acción del store
      }
    } catch (error) {
      console.error("Error al reproducir:", error);
      toast.error("Error al controlar la reproducción");
      setPlayingState(false); // Aseguramos resetear el estado
    }
  };

  // Navegación entre canciones
  const handleSkipForward = () => {
    if (isShuffled && shuffledPlaylist.length > 0) {
      const nextIndex =
        (playedIndices[playedIndices.length - 1] + 1) % shuffledPlaylist.length;
      const newSong = shuffledPlaylist[nextIndex];
      playSong(newSong, shuffledPlaylist); // Usamos shuffledPlaylist para obtener la siguiente canción
    } else {
      const nextIndex =
        (currentPlaylist.indexOf(currentSong) + 1) % currentPlaylist.length;
      const newSong = currentPlaylist[nextIndex];
      playSong(newSong, currentPlaylist);
    }
    setCurrentTime(0);
  };

  const handleSkipBack = () => {
    if (isShuffled && shuffledPlaylist.length > 0) {
      const prevIndex =
        playedIndices.length > 1 ? playedIndices[playedIndices.length - 2] : 0;
      const newSong = shuffledPlaylist[prevIndex];
      playSong(newSong, shuffledPlaylist);
    } else {
      const prevIndex = currentPlaylist.indexOf(currentSong);
      const newIndex =
        prevIndex === 0 ? currentPlaylist.length - 1 : prevIndex - 1;
      const newSong = currentPlaylist[newIndex];
      playSong(newSong, currentPlaylist);
    }
    setCurrentTime(0);
  };


  // Control de shuffle
  const handleToggleShuffle = () => {
    toggleShuffle();
    setTimeout(() => {
      toast.success(
        isShuffled
          ? "Reproducción en orden activada"
          : "Reproducción aleatoria activada"
      );
    }, 0);
  };

  // Formateo de tiempo
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Control de la barra de progreso
  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
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
    isShuffled
  };
}

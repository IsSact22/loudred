import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "../stores/usePlayerStore";
import { FaRandom } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function MusicPlayer() {
  const { currentSong, isPlaying, setIsPlaying, playSong, currentPlaylist, toggleShuffle, isShuffled } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const handleTimeUpdate = () => {
        const newTime = audio.currentTime;
        // Optimizar actualizaciones del tiempo, solo actualizar cada 100ms
        if (Math.abs(newTime - currentTime) >= 0.1) {
          setCurrentTime(newTime);
        }
      };
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      const handleSongEnd = () => {
        handleSkipForward();
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleSongEnd);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleSongEnd);
      };
    }
  }, [currentTime]);

  useEffect(() => {
    if (currentSong && isPlaying && audioRef.current) {
      audioRef.current.play();  // Reproducir automáticamente cuando cambia la canción
    }
  }, [currentSong, isPlaying]);

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

  const handleToggleShuffle = () => {
    toggleShuffle();
    // Usar un setTimeout para mostrar el mensaje correcto después de que se haya actualizado el estado
    setTimeout(() => {
      toast.success(isShuffled ? "Reproducción en orden activada" : "Reproducción aleatoria activada");
    }, 0);
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
          <Button size="icon" className={`p-1 ${isShuffled ? "bg-red-500" : "bg-purple-500"}`} onClick={handleToggleShuffle}>
            <FaRandom className="h-3 w-3 text-white" />
          </Button>
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.music} />
    </div>
  );
}

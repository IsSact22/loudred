import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FaRandom } from "react-icons/fa";
import Link from "next/link";
import { useMusicPlayer } from "@/src/hooks/useMusicPlayer";

export default function MusicPlayer() {
  const {
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
  } = useMusicPlayer();

  if (!currentSong) {
    return <div className="m-4">Selecciona una canción para comenzar</div>;
  }

  return (
    <div className="w-full max-w-[18rem] mx-auto bg-slate-950/80 rounded-lg shadow-lg shadow-red-500/50 overflow-hidden mt-10">
      <img
        className="w-full h-56 object-cover"
        src={currentSong.image ?? "/placeholder.svg"}
        alt={currentSong.title}
      />
      <div className="p-3">
        <div className="uppercase tracking-wide text-xs text-red-500 font-semibold">
          {currentSong.categoryName ?? "Desconocido"}
        </div>
        <div className="mt-1 text-lg font-medium text-white truncate">
          {currentSong.title}
        </div>
        <div className="mt-1 text-sm font-medium text-white truncate">
          <Link
            href={`/profile/${currentSong.userId}`}
            className="text-red-400 hover:text-red-300 mt-2 inline-block"
          >
            {currentSong.username}
          </Link>
        </div>

        <div className="mt-3">
          <Slider
            value={[currentTime]}
            max={duration || 1} // Añadir valor por defecto
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
          <Button
            variant="outline"
            size="icon"
            className="p-1 hover:bg-red-500/20"
            onClick={handleSkipBack}
          >
            <SkipBack className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="p-1 hover:bg-red-500/20"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="p-1 hover:bg-red-500/20"
            onClick={handleSkipForward}
          >
            <SkipForward className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            className={`p-1 hover:opacity-80 transition-opacity ${
              isShuffled ? "bg-red-500" : "bg-purple-500"
            }`}
            onClick={handleToggleShuffle}
          >
            <FaRandom className="h-3 w-3 text-white" />
          </Button>
        </div>
      </div>

      {/* Elemento audio optimizado */}
      <audio
        ref={audioRef}
        key={currentSong.id} // Fuerza recarga al cambiar canción
        hidden
      />
    </div>
  );
}

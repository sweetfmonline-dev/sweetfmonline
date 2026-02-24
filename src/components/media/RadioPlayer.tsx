"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

// Replace this with your actual stream URL (Shoutcast/Icecast)
const STREAM_URL = process.env.NEXT_PUBLIC_RADIO_STREAM_URL || "";

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStream, setHasStream] = useState(!!STREAM_URL);

  useEffect(() => {
    if (STREAM_URL) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.volume = volume;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — user interaction required
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="max-w-md mx-auto bg-charcoal-light rounded-2xl p-8 border border-charcoal-lighter">
      {/* Play Button */}
      <button
        onClick={togglePlay}
        disabled={!hasStream}
        className="w-24 h-24 mx-auto bg-sweet-red rounded-full flex items-center justify-center mb-6 cursor-pointer hover:bg-sweet-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-10 h-10 text-white" />
        ) : (
          <Play className="w-10 h-10 text-white ml-1" />
        )}
      </button>

      <p className="text-white font-semibold text-lg mb-1">
        {hasStream ? (isPlaying ? "Now Playing" : "Sweet FM 106.5") : "Coming Soon"}
      </p>
      <p className="text-gray-400 text-sm mb-6">
        {hasStream
          ? isPlaying
            ? "Live from Twifo Praso, Central Region"
            : "Tap play to listen live"
          : "Live streaming will be available soon. Stay tuned!"}
      </p>

      {/* Volume Control */}
      <div className="flex items-center gap-3 justify-center">
        <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors" aria-label={isMuted ? "Unmute" : "Mute"}>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-48 h-1.5 bg-charcoal-lighter rounded-full appearance-none cursor-pointer accent-sweet-red"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}

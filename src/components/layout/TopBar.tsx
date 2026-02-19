"use client";

import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";

interface WeatherInfo {
  temperature: number;
  condition: string;
}

function weatherFromCode(code: number): { condition: string; Icon: typeof Cloud } {
  if (code === 0) return { condition: "Clear Sky", Icon: Sun };
  if (code <= 3) return { condition: "Partly Cloudy", Icon: Cloud };
  if (code <= 48) return { condition: "Foggy", Icon: Cloud };
  if (code <= 57) return { condition: "Drizzle", Icon: CloudDrizzle };
  if (code <= 67) return { condition: "Rain", Icon: CloudRain };
  if (code <= 77) return { condition: "Snow", Icon: CloudSnow };
  if (code <= 82) return { condition: "Rain Showers", Icon: CloudRain };
  if (code <= 86) return { condition: "Snow Showers", Icon: CloudSnow };
  if (code <= 99) return { condition: "Thunderstorm", Icon: CloudLightning };
  return { condition: "Cloudy", Icon: Cloud };
}

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const today = new Date();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=5.6037&longitude=-0.1870&current=temperature_2m,weather_code&timezone=Africa%2FAccra",
          { next: { revalidate: 1800 } } as RequestInit
        );
        if (!res.ok) return;
        const data = await res.json();
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          condition: weatherFromCode(data.current.weather_code).condition,
        });
      } catch {
        // Silently fail — widget will just not show
      }
    }
    fetchWeather();
  }, []);

  const WeatherIcon = weather
    ? (() => {
        const code = weather.condition;
        if (code.includes("Clear")) return Sun;
        if (code.includes("Thunder")) return CloudLightning;
        if (code.includes("Rain") || code.includes("Shower")) return CloudRain;
        if (code.includes("Drizzle")) return CloudDrizzle;
        if (code.includes("Snow")) return CloudSnow;
        return Cloud;
      })()
    : Cloud;

  return (
    <div
      className={cn(
        "bg-charcoal text-white text-sm py-2 px-4",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Date */}
        <div className="hidden sm:flex items-center gap-2 text-gray-300">
          <span>{formatDate(today)}</span>
        </div>

        {/* Weather Widget */}
        <div className="flex items-center gap-2 text-gray-300">
          <WeatherIcon className="w-4 h-4" />
          <span className="hidden xs:inline">Accra:</span>
          {weather ? (
            <>
              <span className="font-medium text-white">{weather.temperature}°C</span>
              <span className="hidden sm:inline text-gray-400">{weather.condition}</span>
            </>
          ) : (
            <span className="font-medium text-white">--°C</span>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/profile.php?id=100088742005548"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/sweetfmonline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/sweetfm106.5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com/@sweetfmonline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

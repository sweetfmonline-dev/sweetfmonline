import Image from "next/image";
import { Headphones, Clock } from "lucide-react";
import { RadioPlayer } from "@/components/media/RadioPlayer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listen Live | Sweet FM 106.5",
  description: "Listen to Sweet FM 106.5 live from Twifo Praso, Central Region, Ghana. Your favourite radio station streaming 24/7.",
};

export default function LivePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-charcoal to-charcoal-light text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-sweet-red/20 text-sweet-red px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sweet-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sweet-red"></span>
            </span>
            <span className="text-sm font-semibold">LIVE NOW</span>
          </div>

          <Image
            src="/sweet-fm-logo.svg"
            alt="Sweet FM 106.5"
            width={280}
            height={100}
            className="h-20 lg:h-24 w-auto mx-auto mb-6 brightness-0 invert"
          />
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            Your favourite station streaming live from Twifo Praso, Central Region.
            News, music, talk shows, and more — 24/7.
          </p>

          {/* Audio Player */}
          <RadioPlayer />
        </div>
      </div>

      {/* Schedule */}
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-sweet-red" />
          Today&apos;s Schedule
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { time: "5:00 AM - 9:00 AM", show: "Sweet Morning Show", host: "DJ Kofi & Ama", type: "Talk / Music" },
            { time: "9:00 AM - 12:00 PM", show: "Mid-Morning News", host: "Kwame Asante", type: "News / Current Affairs" },
            { time: "12:00 PM - 2:00 PM", show: "Lunchtime Vibes", host: "DJ Abena", type: "Music / Entertainment" },
            { time: "2:00 PM - 4:00 PM", show: "Afternoon Drive", host: "Yaw Boateng", type: "Talk / Music" },
            { time: "4:00 PM - 7:00 PM", show: "Sweet Drive Home", host: "Efua & Kofi", type: "News / Music" },
            { time: "7:00 PM - 10:00 PM", show: "Evening Edition", host: "Ama Serwaa", type: "News / Analysis" },
          ].map((item) => (
            <div
              key={item.time}
              className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="w-4 h-4 text-sweet-red" />
                <span className="text-xs font-semibold text-sweet-red uppercase">{item.type}</span>
              </div>
              <h3 className="font-bold text-charcoal">{item.show}</h3>
              <p className="text-sm text-gray-500 mt-1">with {item.host}</p>
              <p className="text-xs text-gray-400 mt-2">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

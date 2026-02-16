import { Headphones, Play, Clock } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcasts | Sweet FM Online",
  description: "Listen to Sweet FM podcasts — in-depth discussions, interviews, and analysis on Ghana's biggest stories.",
};

const mockPodcasts = [
  {
    id: "1",
    title: "The Big Story",
    description: "Daily deep-dive into Ghana's most important news story. Analysis, context, and expert commentary.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop",
    episodes: 245,
    latestEpisode: "Parliament's Climate Bill: What It Means for Ghana",
    duration: "32 min",
  },
  {
    id: "2",
    title: "Sweet Sports Talk",
    description: "Weekly roundup of Ghanaian and African football, plus GPL analysis and Black Stars updates.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop",
    episodes: 180,
    latestEpisode: "Hearts vs Kotoko: Super Clash Post-Match Analysis",
    duration: "45 min",
  },
  {
    id: "3",
    title: "Business Pulse Ghana",
    description: "Your weekly guide to Ghana's economy, markets, and business landscape with expert guests.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=400&fit=crop",
    episodes: 120,
    latestEpisode: "GDP Growth at 6.2%: Is the Recovery Real?",
    duration: "28 min",
  },
  {
    id: "4",
    title: "Culture & Vibes",
    description: "Exploring Ghanaian arts, music, fashion, and entertainment with the people who shape culture.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    episodes: 95,
    latestEpisode: "Kente Goes Global: UNESCO Recognition Special",
    duration: "38 min",
  },
  {
    id: "5",
    title: "Health Matters",
    description: "Weekly health news, tips, and conversations with medical professionals across Ghana.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop",
    episodes: 78,
    latestEpisode: "Malaria Vaccination Rollout: What Parents Need to Know",
    duration: "25 min",
  },
  {
    id: "6",
    title: "Tech Accra",
    description: "Ghana's tech ecosystem — startups, innovation, digital policy, and the people building the future.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop",
    episodes: 62,
    latestEpisode: "Inside Accra's New $50M Tech Hub",
    duration: "35 min",
  },
];

export default function PodcastsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center gap-3 mb-2">
            <Headphones className="w-8 h-8 text-sweet-red" />
            <h1 className="text-3xl lg:text-4xl font-bold">
              <span className="text-sweet-red">Sweet FM</span> Podcasts
            </h1>
          </div>
          <p className="text-gray-300 mt-2">
            In-depth discussions, interviews, and analysis on Ghana&apos;s biggest stories.
          </p>
        </div>
      </div>

      {/* Podcasts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="group bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Cover Art */}
              <div className="relative aspect-square">
                <Image
                  src={podcast.image}
                  alt={podcast.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl">{podcast.title}</h3>
                  <p className="text-white/70 text-sm mt-1">{podcast.episodes} episodes</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-2">{podcast.description}</p>

                {/* Latest Episode */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Latest Episode</p>
                  <p className="text-sm font-medium text-charcoal line-clamp-1">
                    {podcast.latestEpisode}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {podcast.duration}
                    </div>
                    <button className="flex items-center gap-1 text-sweet-red text-xs font-semibold hover:underline">
                      <Play className="w-3 h-3" />
                      Play
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Play, Clock } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos | Sweet FM Online",
  description: "Watch the latest news videos, interviews, and reports from Sweet FM Online.",
};

const mockVideos = [
  {
    id: "1",
    title: "President Outlines Vision for Ghana's Economic Transformation",
    thumbnail: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop",
    duration: "12:34",
    category: "Politics",
    date: "2 hours ago",
  },
  {
    id: "2",
    title: "Black Stars Training Camp: Exclusive Behind-the-Scenes Access",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop",
    duration: "8:21",
    category: "Sports",
    date: "5 hours ago",
  },
  {
    id: "3",
    title: "Accra Tech Hub Grand Opening Ceremony Highlights",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop",
    duration: "15:07",
    category: "Technology",
    date: "8 hours ago",
  },
  {
    id: "4",
    title: "Cocoa Farmers Speak: Life After the New Support Program",
    thumbnail: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=800&h=450&fit=crop",
    duration: "10:45",
    category: "News",
    date: "1 day ago",
  },
  {
    id: "5",
    title: "ECOWAS Summit: Key Takeaways and Analysis",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop",
    duration: "18:22",
    category: "World",
    date: "1 day ago",
  },
  {
    id: "6",
    title: "Sarkodie Live at Accra Music Festival — Full Performance",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=450&fit=crop",
    duration: "45:10",
    category: "Entertainment",
    date: "2 days ago",
  },
];

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="text-sweet-red">Sweet FM</span> Videos
          </h1>
          <p className="text-gray-300 mt-2">
            Watch the latest news reports, interviews, and exclusive content.
          </p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-sweet-red rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-xs font-bold uppercase text-sweet-red">
                  {video.category}
                </span>
                <h3 className="font-semibold text-charcoal mt-1 line-clamp-2 group-hover:text-sweet-red transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2">{video.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-charcoal hover:bg-charcoal-light text-white font-semibold rounded-lg transition-colors">
            Load More Videos
          </button>
        </div>
      </div>
    </div>
  );
}

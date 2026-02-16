import { Radio, Users, Award, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Sweet FM Online",
  description: "Learn about Sweet FM 106.5 — Ghana's premier news and media portal delivering independent, fearless, and credible journalism.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
              About <span className="text-sweet-red">Sweet FM Online</span>
            </h1>
            <p className="text-gray-300 text-lg mt-4 leading-relaxed">
              Independent. Fearless. Credible. Ghana&apos;s most trusted source for
              breaking news, in-depth analysis, and compelling storytelling.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-charcoal mb-4">Our Story</h2>
              <div className="font-serif text-lg text-gray-700 leading-relaxed space-y-4">
                <p>
                  Sweet FM 106.5 has been at the forefront of Ghanaian journalism,
                  delivering accurate, timely, and impactful news to millions of
                  listeners and readers across the country and beyond.
                </p>
                <p>
                  Our online platform, sweetfmonline.com, extends our reach to the
                  digital world, providing 24/7 coverage of the stories that matter
                  most to Ghanaians — from politics and business to sports,
                  entertainment, health, and technology.
                </p>
                <p>
                  We are committed to upholding the highest standards of journalism,
                  giving voice to the voiceless, and holding power to account. Our
                  team of experienced journalists, editors, and analysts work
                  tirelessly to bring you the news you need to make informed decisions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-charcoal mb-4">Our Mission</h2>
              <div className="font-serif text-lg text-gray-700 leading-relaxed space-y-4">
                <p>
                  To be Ghana&apos;s most trusted and comprehensive news platform,
                  delivering independent, fearless, and credible journalism that
                  informs, educates, and empowers our audience.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-charcoal mb-4">Editorial Policy</h2>
              <div className="font-serif text-lg text-gray-700 leading-relaxed space-y-4">
                <p>
                  Sweet FM Online is committed to accuracy, fairness, and balance in
                  all our reporting. We adhere to the Ghana Journalists Association
                  (GJA) Code of Ethics and the principles of responsible journalism.
                </p>
                <p>
                  We welcome feedback, corrections, and story tips from our readers.
                  If you believe we have made an error, please contact our editorial
                  team and we will investigate promptly.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-1 space-y-6">
            {[
              {
                icon: Radio,
                title: "On Air Since",
                value: "2005",
                desc: "Broadcasting from Accra, Ghana",
              },
              {
                icon: Users,
                title: "Monthly Readers",
                value: "2M+",
                desc: "Across web, mobile, and social",
              },
              {
                icon: Award,
                title: "Awards Won",
                value: "15+",
                desc: "GJA and international recognitions",
              },
              {
                icon: Globe,
                title: "Coverage",
                value: "16 Regions",
                desc: "Nationwide reporting network",
              },
            ].map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm"
              >
                <stat.icon className="w-8 h-8 text-sweet-red mb-3" />
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-charcoal">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

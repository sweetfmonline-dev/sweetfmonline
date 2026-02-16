import { BarChart3, Users, Radio, Globe, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise With Us | Sweet FM Online",
  description: "Reach millions of Ghanaians through Sweet FM 106.5 radio, web, and social media platforms.",
};

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sweet-red to-sweet-red-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
              Advertise With Sweet FM
            </h1>
            <p className="text-white/80 text-lg mt-4 leading-relaxed">
              Connect your brand with millions of engaged Ghanaians across our
              radio, digital, and social media platforms.
            </p>
            <a
              href="mailto:ads@sweetfmonline.com"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-sweet-red font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, value: "2M+", label: "Monthly Web Visitors" },
            { icon: Radio, value: "500K+", label: "Daily Radio Listeners" },
            { icon: Globe, value: "1.5M+", label: "Social Media Followers" },
            { icon: BarChart3, value: "85%", label: "Audience in 18-45 Age Group" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 text-center"
            >
              <stat.icon className="w-6 h-6 text-sweet-red mx-auto mb-2" />
              <p className="text-2xl lg:text-3xl font-bold text-charcoal">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Formats */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
          Advertising Options
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Radio Spots",
              desc: "30s and 60s spots during peak drive-time and news hours. Reach 500K+ daily listeners across Greater Accra and beyond.",
              features: ["Morning Show (5AM-9AM)", "Drive Time (4PM-7PM)", "News Bulletins", "Sponsorship Packages"],
            },
            {
              title: "Display Ads",
              desc: "Banner ads, leaderboards, and sidebar placements on sweetfmonline.com reaching 2M+ monthly visitors.",
              features: ["Homepage Takeover", "Category Sponsorship", "Leaderboard (728x90)", "Sidebar (300x250)"],
            },
            {
              title: "Sponsored Content",
              desc: "Native articles and branded content crafted by our editorial team to engage readers authentically.",
              features: ["Branded Articles", "Video Content", "Podcast Sponsorship", "Newsletter Inclusion"],
            },
            {
              title: "Social Media",
              desc: "Promoted posts and campaigns across our Facebook, Twitter, Instagram, and YouTube channels.",
              features: ["Promoted Posts", "Story Takeovers", "Live Stream Sponsorship", "Influencer Partnerships"],
            },
            {
              title: "Events & Activations",
              desc: "Brand activations at Sweet FM events, concerts, and community outreach programmes.",
              features: ["Event Sponsorship", "On-Ground Activations", "Concert Branding", "Community Events"],
            },
            {
              title: "Custom Packages",
              desc: "Tailored multi-platform campaigns designed to meet your specific marketing objectives.",
              features: ["Multi-Platform Bundles", "Election Coverage Sponsorship", "Sports Packages", "Seasonal Campaigns"],
            },
          ].map((option) => (
            <div
              key={option.title}
              className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-charcoal mb-2">{option.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{option.desc}</p>
              <ul className="space-y-1">
                {option.features.map((f) => (
                  <li key={f} className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sweet-red rounded-full flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-charcoal rounded-xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Ready to Reach Millions?</h3>
          <p className="text-gray-300 max-w-lg mx-auto mb-6">
            Contact our advertising team for rates, media kits, and custom campaign proposals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:ads@sweetfmonline.com"
              className="px-6 py-3 bg-sweet-red hover:bg-sweet-red-dark text-white font-semibold rounded-lg transition-colors"
            >
              Email: ads@sweetfmonline.com
            </a>
            <a
              href="tel:+233302123456"
              className="px-6 py-3 bg-charcoal-light hover:bg-charcoal-lighter text-white font-semibold rounded-lg border border-charcoal-lighter transition-colors"
            >
              Call: +233 (0)30 212 3456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

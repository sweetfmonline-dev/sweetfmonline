import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Sweet FM Online",
  description: "Get in touch with Sweet FM 106.5. Send us news tips, feedback, or advertising inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h1 className="text-3xl lg:text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-300 mt-2">
            Have a news tip, feedback, or inquiry? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 lg:p-8">
              <h2 className="text-xl font-bold text-charcoal mb-6">Send Us a Message</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sweet-red focus:ring-1 focus:ring-sweet-red"
                      placeholder="Kwame Asante"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sweet-red focus:ring-1 focus:ring-sweet-red"
                      placeholder="kwame@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sweet-red focus:ring-1 focus:ring-sweet-red"
                  >
                    <option value="">Select a topic</option>
                    <option value="news-tip">News Tip</option>
                    <option value="feedback">Feedback</option>
                    <option value="correction">Story Correction</option>
                    <option value="advertising">Advertising Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="careers">Careers</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sweet-red focus:ring-1 focus:ring-sweet-red resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-sweet-red hover:bg-sweet-red-dark text-white font-semibold rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-charcoal mb-4">Get In Touch</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sweet-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-charcoal text-sm">Address</p>
                    <p className="text-gray-500 text-sm">Sweet FM House, Labone, Accra, Ghana</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-sweet-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-charcoal text-sm">Phone</p>
                    <p className="text-gray-500 text-sm">+233 (0)30 212 3456</p>
                    <p className="text-gray-500 text-sm">+233 (0)24 000 1065</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sweet-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-charcoal text-sm">Email</p>
                    <p className="text-gray-500 text-sm">info@sweetfmonline.com</p>
                    <p className="text-gray-500 text-sm">news@sweetfmonline.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sweet-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-charcoal text-sm">Newsroom Hours</p>
                    <p className="text-gray-500 text-sm">24/7 — We never sleep</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-sweet-red rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Advertise With Us</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-4">
                Reach millions of Ghanaians through our radio, web, and social media
                platforms. Contact our advertising team for rates and packages.
              </p>
              <a
                href="mailto:ads@sweetfmonline.com"
                className="inline-block px-4 py-2 bg-white text-sweet-red font-semibold text-sm rounded-lg hover:bg-gray-100 transition-colors"
              >
                ads@sweetfmonline.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

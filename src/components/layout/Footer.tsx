import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/sweet-fm-logo.svg"
                alt="Sweet FM 106.5"
                width={240}
                height={90}
                className="h-20 lg:h-24 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Ghana&apos;s premier news portal delivering breaking news, politics,
              business, sports, and entertainment from Ghana and around the world.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=100088742005548" target="_blank" rel="noopener noreferrer" className="p-2 bg-charcoal-light rounded-full text-gray-400 hover:text-white hover:bg-sweet-red transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://x.com/sweetfmonline" target="_blank" rel="noopener noreferrer" className="p-2 bg-charcoal-light rounded-full text-gray-400 hover:text-white hover:bg-sweet-red transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/sweetfm106.5" target="_blank" rel="noopener noreferrer" className="p-2 bg-charcoal-light rounded-full text-gray-400 hover:text-white hover:bg-sweet-red transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@sweetfmonline" target="_blank" rel="noopener noreferrer" className="p-2 bg-charcoal-light rounded-full text-gray-400 hover:text-white hover:bg-sweet-red transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {[
                { label: "News", href: "/category/news" },
                { label: "Politics", href: "/category/politics" },
                { label: "Business", href: "/category/business" },
                { label: "Sports", href: "/category/sports" },
                { label: "Entertainment", href: "/category/entertainment" },
                { label: "World", href: "/category/world" },
                { label: "Opinion", href: "/category/opinion" },
                { label: "Technology", href: "/category/technology" },
                { label: "Health", href: "/category/health" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Advertise With Us", href: "/advertise" },
                { label: "Listen Live", href: "/live" },
                { label: "Videos", href: "/media/videos" },
                { label: "Podcasts", href: "/media/podcasts" },
                { label: "Elections Centre", href: "/category/elections" },
                { label: "Regional News", href: "/category/regional" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Sweet FM House, Twifo Praso, Central Region, Ghana</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+233302123456" className="hover:text-white transition-colors">
                  +233 (0)30 212 3456
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@sweetfmonline.com" className="hover:text-white transition-colors">
                  info@sweetfmonline.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-2">Newsletter</h4>
              <p className="text-gray-400 text-xs mb-3">
                Get the latest news delivered to your inbox.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-charcoal-light border border-charcoal-lighter rounded text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-sweet-red"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sweet-red hover:bg-sweet-red-dark text-white text-sm font-semibold rounded transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-light">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>&copy; {currentYear} Sweet FM Online. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

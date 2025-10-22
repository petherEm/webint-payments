import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  BarChart3,
  LineChart,
  PieChart,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-green-500/20 mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(oklch(0.7 0.18 145 / 0.1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.18 145 / 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/assets/icons/logo_dark.png"
                alt="WebInt Payments Logo"
                width={140}
                height={48}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Modern finance and stock analytics platform with real-time market
              data and advanced trading tools.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-green-500" />
                <span>support@webint.io</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-green-500" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-green-500/20 hover:border-green-500/50 border border-transparent flex items-center justify-center transition-all duration-300 group"
                aria-label="Twitter"
              >
                <svg
                  className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-green-500/20 hover:border-green-500/50 border border-transparent flex items-center justify-center transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-green-500/20 hover:border-green-500/50 border border-transparent flex items-center justify-center transition-all duration-300 group"
                aria-label="GitHub"
              >
                <svg
                  className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-green-500 to-transparent" />
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/markets"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <TrendingUp className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  Markets
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <BarChart3 className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <PieChart className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/trading"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm flex items-center gap-2 group"
                >
                  <LineChart className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  Trading
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-green-500 to-transparent" />
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-green-500 to-transparent" />
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-green-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} WebInt Payments. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

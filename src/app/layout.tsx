import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenAPI Spec Fixer",
  description: "Fix, validate, and separate OpenAPI specification files",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-gray-900 text-white min-h-screen text-sm lg:text-base`}>
        <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="/" className="font-semibold text-white tracking-tight text-lg">
                YAML Fixer
              </a>
              <div className="flex gap-1">
                <a href="/" className="px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                  Processor
                </a>
                <a href="/tracker" className="px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                  API Tracker
                </a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

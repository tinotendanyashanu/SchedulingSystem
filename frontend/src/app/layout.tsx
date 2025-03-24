import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UZ Exam Scheduler",
  description: "Plan smarter, study better",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
          <body className="bg-gray-100 text-gray-800 font-sans">
              <nav className="sticky top-0 bg-white shadow-md p-4 flex justify-between items-center">
                  <a href="/" className="text-2xl font-semibold text-green-800">UZ Exam Scheduler</a>
                  <div className="space-x-6 hidden md:flex">
                      <a href="/" className="hover:text-yellow-500 transition">Dashboard</a>
                      <a href="/courses" className="hover:text-yellow-500 transition">Courses</a>
                      <a href="/timetable" className="hover:text-yellow-500 transition">Timetable</a>
                  </div>
              </nav>
              <main className="p-6">{children}</main>
              <footer className="text-center p-4 text-gray-600">
                  University of Zimbabwe © 2025
              </footer>
          </body>
      </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavBar from "@/_components/nav";
export const metadata: Metadata = {
    title: "UZ Exam Scheduler",
    description: "Timetable management for University of Zimbabwe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-100 text-gray-800 font-sans">
                <NavBar />
                <main className="p-6">{children}</main>
                <footer className="text-center p-4 text-gray-600">
                    University of Zimbabwe © 2025
                </footer>
                <Toaster position="top-right" />
            </body>
        </html>
    );
}

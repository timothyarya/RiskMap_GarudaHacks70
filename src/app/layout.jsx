import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Toast from "@/components/layout/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RiskMap - GH70",
  description: "Stay alert of your surroundings",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh w-full">
        <Navbar />
        <Toast />
        <main
        className="flex flex-row justify-center items-top w-full min-h-dvh"
        >
          {children}
        </main>
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "World Cup 2026 Predictor",
  description: "Predict the World Cup. Top the leaderboard. Brag accordingly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-5xl mx-auto px-4 pb-24">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}

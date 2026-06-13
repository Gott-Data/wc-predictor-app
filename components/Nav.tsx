"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/predictions", label: "Predictions" },
  { href: "/bigboard", label: "Big Board" },
  { href: "/matches", label: "Match Centre" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
  { href: "/admin", label: "Admin" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="py-6 flex items-center justify-between flex-wrap gap-3">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl">⚽</span>
        <span className="font-bold text-lg tracking-tight">
          WC26 Predictor
        </span>
      </Link>
      <nav className="flex gap-1 flex-wrap">
        {links.map((l) => {
          const active =
            l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                active
                  ? "bg-pitch-500 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

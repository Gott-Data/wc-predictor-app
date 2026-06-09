"use client";

import Link from "next/link";
import UserGate from "@/components/UserGate";
import { GROUP_MATCHES, SPECIAL_CATEGORIES } from "@/lib/data";
import { getUserState } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <UserGate>
      {(user) => <Dashboard user={user} />}
    </UserGate>
  );
}

function Dashboard({ user }: { user: { id: string; username: string; avatar: string } }) {
  const [counts, setCounts] = useState({ preds: 0, specials: 0 });

  useEffect(() => {
    const s = getUserState(user.id);
    setCounts({
      preds: Object.keys(s.predictions).length,
      specials: Object.keys(s.specials).length,
    });
  }, [user.id]);

  const totalGroup = GROUP_MATCHES.length;
  const totalSpecials = SPECIAL_CATEGORIES.length;
  const lockDate = new Date("2026-06-11T12:00:00Z");
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((lockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{user.avatar}</span>
          <div>
            <div className="text-sm text-white/60">Welcome back</div>
            <div className="text-xl font-bold">{user.username}</div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-3">
        <Stat label="Group predictions" value={`${counts.preds} / ${totalGroup}`} />
        <Stat label="Big Board picks" value={`${counts.specials} / ${totalSpecials}`} />
        <Stat label="Days until kickoff" value={`${daysLeft}`} hint="June 11 lock" />
      </section>

      <section className="grid sm:grid-cols-2 gap-3">
        <CTA
          href="/predictions"
          title="Make Predictions"
          desc="Pick scores for all 72 group stage matches."
          emoji="🎯"
        />
        <CTA
          href="/bigboard"
          title="The Big Board"
          desc="Tournament-wide picks: Winner, Golden Boot, and chaos."
          emoji="🏆"
        />
        <CTA
          href="/leaderboard"
          title="Leaderboard"
          desc="See who's ahead. (No grades until matches finish.)"
          emoji="📊"
        />
        <CTA
          href="/profile"
          title="Profile"
          desc="Switch player, reset, or check your picks."
          emoji="👤"
        />
      </section>

      <section className="card">
        <h2 className="font-bold mb-2">How scoring works</h2>
        <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
          <li><b>10 pts</b> — exact scoreline</li>
          <li><b>+2 pts</b> — for each team's goal count you got exactly right</li>
          <li><b>6 pts</b> — correct result + correct total goals</li>
          <li><b>3 pts</b> — correct result only</li>
          <li><b>+5 pts</b> — exact 0–0 (clean sheet bonus)</li>
          <li>Knockout multipliers: R16 ×1.5, QF ×2, SF ×3, Final ×4</li>
          <li>⚡ Power Pick doubles a single match</li>
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {hint && <div className="text-xs text-white/40 mt-1">{hint}</div>}
    </div>
  );
}

function CTA({ href, title, desc, emoji }: { href: string; title: string; desc: string; emoji: string }) {
  return (
    <Link href={href} className="card hover:bg-white/10 transition block">
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-bold">{title}</div>
      <div className="text-sm text-white/60">{desc}</div>
    </Link>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import UserGate from "@/components/UserGate";
import { GROUPS, GROUP_MATCHES, teamByName } from "@/lib/data";
import { applyResults } from "@/lib/results";
import { scorePrediction } from "@/lib/scoring";
import { getUserState } from "@/lib/store";
import type { Match, Prediction, User } from "@/lib/types";

export default function MatchesPage() {
  return <UserGate>{(user) => <Matches user={user} />}</UserGate>;
}

function Matches({ user }: { user: User }) {
  const groups = useMemo(() => ["All", ...Object.keys(GROUPS)], []);
  const [activeGroup, setActiveGroup] = useState("All");
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    setPredictions(getUserState(user.id).predictions);
    setMatches(applyResults(GROUP_MATCHES));
  }, [user.id]);

  const visible =
    activeGroup === "All" ? matches : matches.filter((m) => m.group === activeGroup);
  const totalPts = matches.reduce((sum, m) => {
    const p = predictions[m.id];
    return sum + (p ? scorePrediction(m, p) : 0);
  }, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Match Centre ⚽</h1>
          <p className="text-sm text-white/60">
            Your picks vs. results.{" "}
            <span className="text-pitch-500 font-semibold">{totalPts} pts</span> so far.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {groups.map((g) => {
          const active = activeGroup === g;
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                active
                  ? "bg-pitch-500 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {g === "All" ? "All" : `Group ${g}`}
            </button>
          );
        })}
      </div>

      <div className="grid gap-2">
        {visible.map((m) => {
          const p = predictions[m.id];
          const finished = m.status === "finished";
          const pts = p && finished ? scorePrediction(m, p) : null;
          return (
            <div key={m.id} className="card flex items-center gap-3 flex-wrap text-sm">
              <span className="text-xs uppercase tracking-wider text-white/40 w-16">
                {m.group ? `Grp ${m.group}` : m.phase}
              </span>
              <div className="flex-1 min-w-[200px] flex items-center gap-2 justify-end text-right">
                <span className={p?.homeGoals === m.homeScore && finished ? "text-pitch-500 font-bold" : "font-semibold"}>
                  {m.home}
                </span>
                <span className="text-xl">{teamByName(m.home)?.flag}</span>
              </div>
              <ScoreBlock label="Pick" h={p?.homeGoals} a={p?.awayGoals} />
              <ScoreBlock
                label="Result"
                h={finished ? m.homeScore : undefined}
                a={finished ? m.awayScore : undefined}
                emphasis
              />
              <div className="flex-1 min-w-[200px] flex items-center gap-2">
                <span className="text-xl">{teamByName(m.away)?.flag}</span>
                <span className={p?.awayGoals === m.awayScore && finished ? "text-pitch-500 font-bold" : "font-semibold"}>
                  {m.away}
                </span>
              </div>
              <div className="w-16 text-right">
                {pts !== null && (
                  <span className={`font-bold ${pts > 0 ? "text-pitch-500" : "text-white/40"}`}>
                    {pts > 0 ? `+${pts}` : "0"}
                  </span>
                )}
                {p?.powerPick && <span className="ml-1 text-yellow-400">⚡</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreBlock({
  label,
  h,
  a,
  emphasis,
}: {
  label: string;
  h?: number;
  a?: number;
  emphasis?: boolean;
}) {
  const has = h !== undefined && a !== undefined;
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      <div className={`font-mono ${emphasis ? "text-base font-bold" : "text-sm"}`}>
        {has ? `${h}–${a}` : "—"}
      </div>
    </div>
  );
}

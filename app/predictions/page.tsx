"use client";

import { useEffect, useMemo, useState } from "react";
import UserGate from "@/components/UserGate";
import MatchCard from "@/components/MatchCard";
import { GROUPS, GROUP_MATCHES } from "@/lib/data";
import { getUserState, setPrediction } from "@/lib/store";
import type { Prediction, User } from "@/lib/types";

export default function PredictionsPage() {
  return <UserGate>{(user) => <Predictions user={user} />}</UserGate>;
}

function Predictions({ user }: { user: User }) {
  const groups = useMemo(() => Object.keys(GROUPS), []);
  const [activeGroup, setActiveGroup] = useState("A");
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});

  useEffect(() => {
    setPredictions(getUserState(user.id).predictions);
  }, [user.id]);

  const matches = GROUP_MATCHES.filter((m) => m.group === activeGroup);
  const totalMade = Object.keys(predictions).length;

  function handleSave(matchId: string, h: number, a: number, pp: boolean) {
    setPrediction(user.id, matchId, { homeGoals: h, awayGoals: a, powerPick: pp });
    setPredictions(getUserState(user.id).predictions);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Group Stage Predictions</h1>
          <p className="text-sm text-white/60">
            {totalMade} of {GROUP_MATCHES.length} matches predicted
          </p>
        </div>
        <div className="text-xs text-white/50">
          🔒 locks at first kickoff — June 11
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {groups.map((g) => {
          const inGroup = GROUP_MATCHES.filter((m) => m.group === g);
          const done = inGroup.filter((m) => predictions[m.id]).length;
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
              Group {g}
              <span className="ml-1.5 text-xs opacity-70">
                {done}/{inGroup.length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">Group {activeGroup}</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {GROUPS[activeGroup].map((t) => (
            <span key={t.name} className="px-2 py-1 rounded bg-white/5">
              {t.flag} {t.name}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            prediction={predictions[m.id]}
            onSave={(h, a, pp) => handleSave(m.id, h, a, pp)}
          />
        ))}
      </div>
    </div>
  );
}

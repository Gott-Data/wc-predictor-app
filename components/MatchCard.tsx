"use client";

import { useState } from "react";
import type { Match, Prediction } from "@/lib/types";
import { teamByName } from "@/lib/data";

export default function MatchCard({
  match,
  prediction,
  onSave,
  locked,
}: {
  match: Match;
  prediction?: Prediction;
  onSave: (homeGoals: number, awayGoals: number, powerPick: boolean) => void;
  locked?: boolean;
}) {
  const home = teamByName(match.home);
  const away = teamByName(match.away);
  const [h, setH] = useState<number>(prediction?.homeGoals ?? 0);
  const [a, setA] = useState<number>(prediction?.awayGoals ?? 0);
  const [pp, setPp] = useState<boolean>(prediction?.powerPick ?? false);
  const [saved, setSaved] = useState(false);

  function bump(setter: (n: number) => void, val: number, delta: number) {
    const next = Math.max(0, Math.min(9, val + delta));
    setter(next);
  }

  function handleSave() {
    onSave(h, a, pp);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-2">
        <TeamSide flag={home?.flag} name={match.home} align="right" />
        <div className="flex items-center gap-2">
          <ScoreBox value={h} onMinus={() => bump(setH, h, -1)} onPlus={() => bump(setH, h, 1)} setValue={setH} disabled={!!locked} />
          <span className="text-white/40">–</span>
          <ScoreBox value={a} onMinus={() => bump(setA, a, -1)} onPlus={() => bump(setA, a, 1)} setValue={setA} disabled={!!locked} />
        </div>
        <TeamSide flag={away?.flag} name={match.away} align="left" />
      </div>
      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
          <input
            type="checkbox"
            checked={pp}
            disabled={!!locked}
            onChange={(e) => setPp(e.target.checked)}
            className="accent-pitch-500"
          />
          ⚡ Power Pick (2x — one match only)
        </label>
        <div className="flex items-center gap-2">
          {prediction && !saved && (
            <span className="text-xs text-white/50">
              saved {timeAgo(prediction.submittedAt)}
            </span>
          )}
          {saved && (
            <span className="text-xs text-pitch-500 font-semibold">✓ saved</span>
          )}
          {!locked && (
            <button onClick={handleSave} className="btn-primary text-xs">
              Lock in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamSide({
  flag,
  name,
  align,
}: {
  flag?: string;
  name: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex-1 flex items-center gap-2 ${
        align === "right" ? "justify-end text-right" : "justify-start text-left"
      }`}
    >
      {align === "left" && <span className="text-2xl">{flag}</span>}
      <span className="font-semibold text-sm sm:text-base">{name}</span>
      {align === "right" && <span className="text-2xl">{flag}</span>}
    </div>
  );
}

function ScoreBox({
  value,
  onMinus,
  onPlus,
  setValue,
  disabled,
}: {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  setValue: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onPlus}
        disabled={disabled}
        className="text-white/40 hover:text-white text-xs"
      >
        ▲
      </button>
      <input
        type="number"
        min={0}
        max={9}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const n = parseInt(e.target.value || "0", 10);
          if (!isNaN(n)) setValue(Math.max(0, Math.min(9, n)));
        }}
        className="score-input"
      />
      <button
        type="button"
        onClick={onMinus}
        disabled={disabled}
        className="text-white/40 hover:text-white text-xs"
      >
        ▼
      </button>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

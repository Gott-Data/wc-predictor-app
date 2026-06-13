"use client";

import { useEffect, useMemo, useState } from "react";
import { GROUPS, GROUP_MATCHES, teamByName } from "@/lib/data";
import { clearResult, getResults, setResult } from "@/lib/results";

export default function AdminPage() {
  const groups = useMemo(() => Object.keys(GROUPS), []);
  const [activeGroup, setActiveGroup] = useState("A");
  const [results, setResults] = useState<Record<string, { homeScore: number; awayScore: number }>>({});

  useEffect(() => {
    const r = getResults();
    const flat: Record<string, { homeScore: number; awayScore: number }> = {};
    Object.entries(r).forEach(([k, v]) => {
      flat[k] = { homeScore: v.homeScore, awayScore: v.awayScore };
    });
    setResults(flat);
  }, []);

  const matches = GROUP_MATCHES.filter((m) => m.group === activeGroup);
  const totalFinished = Object.keys(results).length;

  function save(matchId: string, h: number, a: number) {
    setResult(matchId, h, a);
    setResults({ ...results, [matchId]: { homeScore: h, awayScore: a } });
  }

  function clear(matchId: string) {
    clearResult(matchId);
    const next = { ...results };
    delete next[matchId];
    setResults(next);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Admin · Match Results 🎛️</h1>
          <p className="text-sm text-white/60">
            Enter final scores to grade predictions. {totalFinished} / {GROUP_MATCHES.length} graded.
          </p>
        </div>
        <div className="text-xs text-white/40">
          Local device only. Wire to API in Phase 2.
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {groups.map((g) => {
          const inGroup = GROUP_MATCHES.filter((m) => m.group === g);
          const done = inGroup.filter((m) => results[m.id]).length;
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

      <div className="grid gap-3">
        {matches.map((m) => (
          <ResultRow
            key={m.id}
            match={m}
            current={results[m.id]}
            onSave={save}
            onClear={() => clear(m.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ResultRow({
  match,
  current,
  onSave,
  onClear,
}: {
  match: { id: string; home: string; away: string };
  current?: { homeScore: number; awayScore: number };
  onSave: (id: string, h: number, a: number) => void;
  onClear: () => void;
}) {
  const [h, setH] = useState<number>(current?.homeScore ?? 0);
  const [a, setA] = useState<number>(current?.awayScore ?? 0);
  const home = teamByName(match.home);
  const away = teamByName(match.away);

  useEffect(() => {
    setH(current?.homeScore ?? 0);
    setA(current?.awayScore ?? 0);
  }, [current?.homeScore, current?.awayScore]);

  return (
    <div className="card flex items-center gap-3 flex-wrap">
      <div className="flex-1 min-w-[180px] flex items-center gap-2 justify-end text-right">
        <span className="font-semibold">{match.home}</span>
        <span className="text-2xl">{home?.flag}</span>
      </div>
      <input
        type="number"
        min={0}
        value={h}
        onChange={(e) => setH(Math.max(0, parseInt(e.target.value || "0", 10)))}
        className="score-input"
      />
      <span className="text-white/40">–</span>
      <input
        type="number"
        min={0}
        value={a}
        onChange={(e) => setA(Math.max(0, parseInt(e.target.value || "0", 10)))}
        className="score-input"
      />
      <div className="flex-1 min-w-[180px] flex items-center gap-2">
        <span className="text-2xl">{away?.flag}</span>
        <span className="font-semibold">{match.away}</span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        <button onClick={() => onSave(match.id, h, a)} className="btn-primary text-xs">
          {current ? "Update" : "Grade"}
        </button>
        {current && (
          <button onClick={onClear} className="btn-ghost text-xs">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

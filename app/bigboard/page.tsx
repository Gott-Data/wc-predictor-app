"use client";

import { useEffect, useState } from "react";
import UserGate from "@/components/UserGate";
import { ALL_TEAMS, SPECIAL_CATEGORIES, TOP_SCORER_SHORTLIST } from "@/lib/data";
import { getUserState, setSpecial } from "@/lib/store";
import type { User } from "@/lib/types";

export default function BigBoardPage() {
  return <UserGate>{(user) => <BigBoard user={user} />}</UserGate>;
}

function BigBoard({ user }: { user: User }) {
  const [specials, setSpecials] = useState<Record<string, string>>({});
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  useEffect(() => {
    setSpecials(getUserState(user.id).specials);
  }, [user.id]);

  function update(category: string, value: string) {
    setSpecial(user.id, category, value);
    setSpecials({ ...specials, [category]: value });
    setSavedFlash(category);
    setTimeout(() => setSavedFlash((v) => (v === category ? null : v)), 800);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">The Big Board 🏆</h1>
        <p className="text-sm text-white/60">
          Tournament-wide predictions. Locks at June 11 kickoff.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {SPECIAL_CATEGORIES.map((cat) => {
          const value = specials[cat.id] ?? "";
          return (
            <div key={cat.id} className="card">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{cat.label}</div>
                  <div className="text-xs text-white/50">+{cat.points} pts if correct</div>
                </div>
                {savedFlash === cat.id && (
                  <span className="text-xs text-pitch-500 font-semibold">✓</span>
                )}
              </div>
              <Field
                cat={cat}
                value={value}
                onChange={(v) => update(cat.id, v)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  cat,
  value,
  onChange,
}: {
  cat: (typeof SPECIAL_CATEGORIES)[number];
  value: string;
  onChange: (v: string) => void;
}) {
  if (cat.type === "team") {
    return (
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— pick a team —</option>
        {ALL_TEAMS.map((t) => (
          <option key={t.name} value={t.name}>
            {t.flag} {t.name} (Group {t.group})
          </option>
        ))}
      </select>
    );
  }
  if (cat.type === "player") {
    return (
      <div className="space-y-1">
        <input
          className="input"
          list={`players-${cat.id}`}
          placeholder="Type a player name…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <datalist id={`players-${cat.id}`}>
          {TOP_SCORER_SHORTLIST.map((p) => (
            <option key={p.player} value={p.player}>
              {p.country}
            </option>
          ))}
        </datalist>
      </div>
    );
  }
  if (cat.type === "number") {
    return (
      <input
        type="number"
        className="input"
        placeholder="e.g. 170"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (cat.type === "yesno") {
    return (
      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
              value === opt
                ? "bg-pitch-500 text-white"
                : "bg-white/5 hover:bg-white/10 text-white/70"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }
  return (
    <input
      className="input"
      placeholder="Type your pick…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

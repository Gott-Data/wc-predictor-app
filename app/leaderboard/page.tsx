"use client";

import { useEffect, useState } from "react";
import { GROUP_MATCHES } from "@/lib/data";
import { getUsers, getUserState } from "@/lib/store";
import { applyResults } from "@/lib/results";
import { totalPoints } from "@/lib/scoring";
import type { User } from "@/lib/types";

type Row = {
  user: User;
  points: number;
  preds: number;
};

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<"overall" | "participation">("overall");

  useEffect(() => {
    const users = getUsers();
    const graded = applyResults(GROUP_MATCHES);
    const data: Row[] = users.map((u) => {
      const s = getUserState(u.id);
      return {
        user: u,
        points: totalPoints(graded, s.predictions),
        preds: Object.keys(s.predictions).length,
      };
    });
    setRows(data);
  }, []);

  const sorted = [...rows].sort((a, b) =>
    tab === "overall" ? b.points - a.points : b.preds - a.preds,
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard 📊</h1>
        <p className="text-sm text-white/60">
          Points appear once matches are graded (admin enters results).
        </p>
      </div>

      <div className="flex gap-1">
        <Tab active={tab === "overall"} onClick={() => setTab("overall")}>
          Overall points
        </Tab>
        <Tab active={tab === "participation"} onClick={() => setTab("participation")}>
          Participation
        </Tab>
      </div>

      {sorted.length === 0 ? (
        <div className="card text-center text-white/60">
          No players yet — share this device or invite friends.
        </div>
      ) : (
        <div className="card divide-y divide-white/10">
          {sorted.map((r, i) => (
            <div key={r.user.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
              <div className={`w-8 text-center font-bold ${rankColor(i)}`}>
                {i + 1}
              </div>
              <div className="text-2xl">{r.user.avatar}</div>
              <div className="flex-1">
                <div className="font-semibold">{r.user.username}</div>
                <div className="text-xs text-white/50">
                  {r.preds} predictions made
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {tab === "overall" ? r.points : r.preds}
                </div>
                <div className="text-xs text-white/40">
                  {tab === "overall" ? "pts" : "picks"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function rankColor(i: number): string {
  if (i === 0) return "text-yellow-400";
  if (i === 1) return "text-slate-300";
  if (i === 2) return "text-amber-600";
  return "text-white/50";
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
        active
          ? "bg-pitch-500 text-white"
          : "bg-white/5 text-white/70 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

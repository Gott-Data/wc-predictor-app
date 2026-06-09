"use client";

import { useEffect, useState } from "react";
import UserGate from "@/components/UserGate";
import { GROUP_MATCHES, SPECIAL_CATEGORIES, teamByName } from "@/lib/data";
import {
  deleteUser,
  getActiveUser,
  getUserState,
  setActiveUserId,
} from "@/lib/store";
import type { Prediction, User } from "@/lib/types";

export default function ProfilePage() {
  return <UserGate>{(user) => <Profile user={user} />}</UserGate>;
}

function Profile({ user }: { user: User }) {
  const [state, setState] = useState({
    predictions: {} as Record<string, Prediction>,
    specials: {} as Record<string, string>,
  });

  useEffect(() => {
    setState(getUserState(user.id));
  }, [user.id]);

  const powerMatchId = Object.values(state.predictions).find((p) => p.powerPick)?.matchId;
  const powerMatch = powerMatchId ? GROUP_MATCHES.find((m) => m.id === powerMatchId) : undefined;

  function handleSignOut() {
    setActiveUserId(null);
    location.href = "/";
  }

  function handleDelete() {
    if (!confirm("Delete this profile and all predictions on this device?")) return;
    deleteUser(user.id);
    location.href = "/";
  }

  return (
    <div className="space-y-5">
      <div className="card flex items-center gap-3">
        <span className="text-5xl">{user.avatar}</span>
        <div className="flex-1">
          <div className="text-sm text-white/60">Player</div>
          <div className="text-xl font-bold">{user.username}</div>
          <div className="text-xs text-white/40">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="btn-ghost text-xs" onClick={handleSignOut}>
            Switch player
          </button>
          <button
            className="btn text-xs bg-red-500/20 hover:bg-red-500/30 text-red-200"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="Group predictions" value={Object.keys(state.predictions).length} />
        <Stat label="Big Board picks" value={Object.keys(state.specials).length} />
        <Stat label="Power Pick" value={powerMatch ? `${powerMatch.home} v ${powerMatch.away}` : "—"} />
      </div>

      <section>
        <h2 className="font-bold mb-2">Your picks</h2>
        {Object.values(state.predictions).length === 0 ? (
          <div className="card text-sm text-white/60">No predictions yet.</div>
        ) : (
          <div className="card divide-y divide-white/10">
            {Object.values(state.predictions).map((p) => {
              const m = GROUP_MATCHES.find((x) => x.id === p.matchId);
              if (!m) return null;
              return (
                <div key={p.matchId} className="py-2 flex items-center text-sm">
                  <span className="flex-1">
                    {teamByName(m.home)?.flag} {m.home} v {m.away} {teamByName(m.away)?.flag}
                  </span>
                  <span className="font-bold">
                    {p.homeGoals}–{p.awayGoals}
                  </span>
                  {p.powerPick && <span className="ml-2 text-yellow-400">⚡</span>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-bold mb-2">Big Board</h2>
        {Object.keys(state.specials).length === 0 ? (
          <div className="card text-sm text-white/60">No specials picked yet.</div>
        ) : (
          <div className="card divide-y divide-white/10">
            {SPECIAL_CATEGORIES.filter((c) => state.specials[c.id]).map((c) => (
              <div key={c.id} className="py-2 flex items-center text-sm">
                <span className="flex-1">{c.label}</span>
                <span className="font-semibold">{state.specials[c.id]}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

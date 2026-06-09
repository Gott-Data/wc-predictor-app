"use client";

import { useEffect, useState } from "react";
import {
  createUser,
  getActiveUser,
  getUsers,
  setActiveUserId,
} from "@/lib/store";
import type { User } from "@/lib/types";

const AVATARS = ["⚽", "🦁", "🐅", "🦅", "🐺", "🦊", "🐉", "🦈", "🐧", "🐙", "🦄", "🐲", "🦓", "🐯", "🥷", "🤠"];

export default function UserGate({
  children,
}: {
  children: (user: User) => React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  useEffect(() => {
    setUser(getActiveUser());
    setUsers(getUsers());
    setReady(true);
  }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const u = createUser(name, avatar);
    setUser(u);
    setUsers(getUsers());
  }

  function switchTo(id: string) {
    setActiveUserId(id);
    setUser(getActiveUser());
  }

  if (!ready) return null;

  if (user) return <>{children(user)}</>;

  return (
    <div className="card max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-1">Welcome 👋</h2>
      <p className="text-sm text-white/70 mb-4">
        Pick a display name and emoji to start predicting. (Local-only profile —
        no password, just for fun.)
      </p>

      {users.length > 0 && (
        <div className="mb-5">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">
            Existing players on this device
          </div>
          <div className="flex flex-wrap gap-2">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => switchTo(u.id)}
                className="btn-ghost"
              >
                <span className="mr-1.5">{u.avatar}</span>
                {u.username}
              </button>
            ))}
          </div>
          <div className="border-t border-white/10 my-4" />
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-3">
        <div>
          <label className="text-xs uppercase tracking-wider text-white/50">
            Display name
          </label>
          <input
            className="input mt-1"
            placeholder="e.g. Desh the Destroyer"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-white/50">
            Avatar
          </label>
          <div className="flex flex-wrap gap-1 mt-1">
            {AVATARS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAvatar(a)}
                className={`text-2xl w-10 h-10 rounded-md ${
                  avatar === a
                    ? "bg-pitch-500"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-primary w-full">Start predicting</button>
      </form>
    </div>
  );
}

"use client";

import type { Prediction, User, UserState } from "./types";

const USERS_KEY = "wc26.users";
const ACTIVE_USER_KEY = "wc26.activeUser";
const STATE_PREFIX = "wc26.state.";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  return safeParse<User[]>(localStorage.getItem(USERS_KEY), []);
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getActiveUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_USER_KEY);
}

export function setActiveUserId(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_USER_KEY, id);
  else localStorage.removeItem(ACTIVE_USER_KEY);
}

export function getActiveUser(): User | null {
  const id = getActiveUserId();
  if (!id) return null;
  return getUsers().find((u) => u.id === id) ?? null;
}

export function createUser(username: string, avatar: string): User {
  const user: User = {
    id: cryptoRandomId(),
    username: username.trim(),
    avatar,
    createdAt: new Date().toISOString(),
  };
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  setActiveUserId(user.id);
  return user;
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getUserState(userId: string): UserState {
  if (typeof window === "undefined") return { predictions: {}, specials: {} };
  return safeParse<UserState>(
    localStorage.getItem(STATE_PREFIX + userId),
    { predictions: {}, specials: {} },
  );
}

export function saveUserState(userId: string, state: UserState) {
  localStorage.setItem(STATE_PREFIX + userId, JSON.stringify(state));
}

export function setPrediction(userId: string, matchId: string, p: Omit<Prediction, "matchId" | "submittedAt">) {
  const state = getUserState(userId);
  state.predictions[matchId] = {
    matchId,
    homeGoals: p.homeGoals,
    awayGoals: p.awayGoals,
    powerPick: p.powerPick,
    submittedAt: new Date().toISOString(),
  };
  // Only one power pick per user (latest wins) for MVP simplicity.
  if (p.powerPick) {
    for (const k of Object.keys(state.predictions)) {
      if (k !== matchId) state.predictions[k].powerPick = false;
    }
  }
  saveUserState(userId, state);
}

export function setSpecial(userId: string, category: string, value: string) {
  const state = getUserState(userId);
  if (value.trim() === "") delete state.specials[category];
  else state.specials[category] = value;
  saveUserState(userId, state);
}

export function deleteUser(userId: string) {
  const users = getUsers().filter((u) => u.id !== userId);
  saveUsers(users);
  localStorage.removeItem(STATE_PREFIX + userId);
  if (getActiveUserId() === userId) setActiveUserId(null);
}

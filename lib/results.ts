"use client";

import type { Match } from "./types";

const RESULTS_KEY = "wc26.results";

type ResultEntry = {
  homeScore: number;
  awayScore: number;
  status: "finished";
};

type ResultMap = Record<string, ResultEntry>;

function read(): ResultMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function write(map: ResultMap) {
  localStorage.setItem(RESULTS_KEY, JSON.stringify(map));
}

export function getResults(): ResultMap {
  return read();
}

export function setResult(matchId: string, homeScore: number, awayScore: number) {
  const map = read();
  map[matchId] = { homeScore, awayScore, status: "finished" };
  write(map);
}

export function clearResult(matchId: string) {
  const map = read();
  delete map[matchId];
  write(map);
}

// Merge stored results into a match list so scoring works against the same shape.
export function applyResults<M extends Match>(matches: M[]): M[] {
  const map = read();
  return matches.map((m) => {
    const r = map[m.id];
    if (!r) return m;
    return { ...m, homeScore: r.homeScore, awayScore: r.awayScore, status: r.status };
  });
}

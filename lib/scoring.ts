import type { Match, Phase, Prediction } from "./types";

const PHASE_MULTIPLIER: Record<Phase, number> = {
  group: 1,
  r32: 1,
  r16: 1.5,
  qf: 2,
  sf: 3,
  final: 4,
  specials: 1,
};

export function scorePrediction(match: Match, p: Prediction): number {
  if (
    match.status !== "finished" ||
    match.homeScore === undefined ||
    match.awayScore === undefined
  ) {
    return 0;
  }

  const ph = p.homeGoals;
  const pa = p.awayGoals;
  const mh = match.homeScore;
  const ma = match.awayScore;

  let pts = 0;

  const exact = ph === mh && pa === ma;
  const predResult = Math.sign(ph - pa);
  const actualResult = Math.sign(mh - ma);
  const correctResult = predResult === actualResult;
  const correctTotal = ph + pa === mh + ma;

  if (exact) pts += 10;
  else if (correctResult && correctTotal) pts += 6;
  else if (correctResult) pts += 3;

  // +2 bonus per correctly predicted team goal count (stackable)
  if (ph === mh) pts += 2;
  if (pa === ma) pts += 2;

  // Clean sheet bonus
  if (exact && mh === 0 && ma === 0) pts += 5;

  pts = Math.round(pts * PHASE_MULTIPLIER[match.phase]);

  if (p.powerPick) pts *= 2;

  return pts;
}

export function totalPoints(
  matches: Match[],
  predictions: Record<string, Prediction>,
): number {
  let sum = 0;
  for (const m of matches) {
    const p = predictions[m.id];
    if (p) sum += scorePrediction(m, p);
  }
  return sum;
}

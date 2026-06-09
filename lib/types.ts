export type Phase =
  | "group"
  | "r32"
  | "r16"
  | "qf"
  | "sf"
  | "final"
  | "specials";

export type Team = {
  name: string;
  flag: string;
  group: string;
};

export type Match = {
  id: string;
  phase: Phase;
  group?: string;
  home: string;
  away: string;
  kickoff: string;
  homeScore?: number;
  awayScore?: number;
  status: "scheduled" | "live" | "finished";
};

export type Prediction = {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  powerPick?: boolean;
  submittedAt: string;
};

export type SpecialPick = {
  category: string;
  value: string;
};

export type User = {
  id: string;
  username: string;
  avatar: string;
  createdAt: string;
};

export type UserState = {
  predictions: Record<string, Prediction>;
  specials: Record<string, string>;
};

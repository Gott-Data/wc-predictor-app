import type { Match, Team } from "./types";

export const GROUPS: Record<string, Team[]> = {
  A: [
    { name: "Mexico", flag: "🇲🇽", group: "A" },
    { name: "South Africa", flag: "🇿🇦", group: "A" },
    { name: "South Korea", flag: "🇰🇷", group: "A" },
    { name: "Czechia", flag: "🇨🇿", group: "A" },
  ],
  B: [
    { name: "Canada", flag: "🇨🇦", group: "B" },
    { name: "Bosnia-Herzegovina", flag: "🇧🇦", group: "B" },
    { name: "Qatar", flag: "🇶🇦", group: "B" },
    { name: "Switzerland", flag: "🇨🇭", group: "B" },
  ],
  C: [
    { name: "Brazil", flag: "🇧🇷", group: "C" },
    { name: "Morocco", flag: "🇲🇦", group: "C" },
    { name: "Haiti", flag: "🇭🇹", group: "C" },
    { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C" },
  ],
  D: [
    { name: "United States", flag: "🇺🇸", group: "D" },
    { name: "Paraguay", flag: "🇵🇾", group: "D" },
    { name: "Australia", flag: "🇦🇺", group: "D" },
    { name: "Türkiye", flag: "🇹🇷", group: "D" },
  ],
  E: [
    { name: "Germany", flag: "🇩🇪", group: "E" },
    { name: "Curaçao", flag: "🇨🇼", group: "E" },
    { name: "Ivory Coast", flag: "🇨🇮", group: "E" },
    { name: "Ecuador", flag: "🇪🇨", group: "E" },
  ],
  F: [
    { name: "Netherlands", flag: "🇳🇱", group: "F" },
    { name: "Japan", flag: "🇯🇵", group: "F" },
    { name: "Sweden", flag: "🇸🇪", group: "F" },
    { name: "Tunisia", flag: "🇹🇳", group: "F" },
  ],
  G: [
    { name: "Belgium", flag: "🇧🇪", group: "G" },
    { name: "Egypt", flag: "🇪🇬", group: "G" },
    { name: "Iran", flag: "🇮🇷", group: "G" },
    { name: "New Zealand", flag: "🇳🇿", group: "G" },
  ],
  H: [
    { name: "Spain", flag: "🇪🇸", group: "H" },
    { name: "Cape Verde", flag: "🇨🇻", group: "H" },
    { name: "Saudi Arabia", flag: "🇸🇦", group: "H" },
    { name: "Uruguay", flag: "🇺🇾", group: "H" },
  ],
  I: [
    { name: "France", flag: "🇫🇷", group: "I" },
    { name: "Senegal", flag: "🇸🇳", group: "I" },
    { name: "Iraq", flag: "🇮🇶", group: "I" },
    { name: "Norway", flag: "🇳🇴", group: "I" },
  ],
  J: [
    { name: "Argentina", flag: "🇦🇷", group: "J" },
    { name: "Algeria", flag: "🇩🇿", group: "J" },
    { name: "Austria", flag: "🇦🇹", group: "J" },
    { name: "Jordan", flag: "🇯🇴", group: "J" },
  ],
  K: [
    { name: "Portugal", flag: "🇵🇹", group: "K" },
    { name: "Congo DR", flag: "🇨🇩", group: "K" },
    { name: "Uzbekistan", flag: "🇺🇿", group: "K" },
    { name: "Colombia", flag: "🇨🇴", group: "K" },
  ],
  L: [
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L" },
    { name: "Croatia", flag: "🇭🇷", group: "L" },
    { name: "Ghana", flag: "🇬🇭", group: "L" },
    { name: "Panama", flag: "🇵🇦", group: "L" },
  ],
};

export const ALL_TEAMS: Team[] = Object.values(GROUPS).flat();

export function teamByName(name: string): Team | undefined {
  return ALL_TEAMS.find((t) => t.name === name);
}

// Generate the 6 round-robin fixtures for a group of 4 teams.
// Pairings: 0v1, 2v3, 0v2, 1v3, 0v3, 1v2 (standard schedule).
function fixturesForGroup(group: string, teams: Team[]): Match[] {
  const pairs: [number, number][] = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
    [0, 3],
    [1, 2],
  ];
  return pairs.map(([h, a], i) => ({
    id: `${group}-${i + 1}`,
    phase: "group" as const,
    group,
    home: teams[h].name,
    away: teams[a].name,
    kickoff: matchdayKickoff(group, i),
    status: "scheduled" as const,
  }));
}

// Spread group matches across MD1 (Jun 11-15), MD2 (Jun 16-21), MD3 (Jun 22-27).
function matchdayKickoff(group: string, fixtureIdx: number): string {
  const matchday = Math.floor(fixtureIdx / 2) + 1;
  const baseDate =
    matchday === 1 ? "2026-06-13" : matchday === 2 ? "2026-06-19" : "2026-06-25";
  const groupOffset = group.charCodeAt(0) - "A".charCodeAt(0);
  const hour = 12 + (groupOffset % 8);
  return `${baseDate}T${String(hour).padStart(2, "0")}:00:00Z`;
}

export const GROUP_MATCHES: Match[] = Object.entries(GROUPS).flatMap(
  ([group, teams]) => fixturesForGroup(group, teams),
);

export const TOP_SCORER_SHORTLIST = [
  { player: "Kylian Mbappé", country: "France" },
  { player: "Lionel Messi", country: "Argentina" },
  { player: "Erling Haaland", country: "Norway" },
  { player: "Vinicius Jr", country: "Brazil" },
  { player: "Harry Kane", country: "England" },
  { player: "Bukayo Saka", country: "England" },
  { player: "Lamine Yamal", country: "Spain" },
  { player: "Pedri", country: "Spain" },
  { player: "Jamal Musiala", country: "Germany" },
  { player: "Florian Wirtz", country: "Germany" },
  { player: "Rodri", country: "Spain" },
  { player: "Bruno Fernandes", country: "Portugal" },
  { player: "Romelu Lukaku", country: "Belgium" },
  { player: "Memphis Depay", country: "Netherlands" },
  { player: "Richarlison", country: "Brazil" },
  { player: "Patrik Schick", country: "Czechia" },
];

export const SPECIAL_CATEGORIES = [
  // Core awards
  { id: "winner", label: "🏆 Tournament Winner", points: 25, type: "team" as const },
  { id: "runnerUp", label: "🥈 Runner-up", points: 15, type: "team" as const },
  { id: "third", label: "🥉 Third Place", points: 10, type: "team" as const },
  { id: "topScorer", label: "⚽ Golden Boot (Top Scorer)", points: 20, type: "player" as const },
  { id: "goldenGlove", label: "🧤 Golden Glove (Best GK)", points: 15, type: "text" as const },
  { id: "goldenBall", label: "🎖️ Golden Ball (Best Player)", points: 15, type: "text" as const },
  { id: "youngPlayer", label: "🐣 Best Young Player (U21)", points: 15, type: "text" as const },
  // Stats
  { id: "totalGoals", label: "📊 Total goals in tournament (±5 / ±10)", points: 10, type: "number" as const },
  { id: "hatTricks", label: "🎩 Number of hat-tricks (exact)", points: 15, type: "number" as const },
  { id: "redCards", label: "🟥 Number of red cards (exact)", points: 10, type: "number" as const },
  { id: "mostCleanSheets", label: "🧱 Team with most clean sheets", points: 10, type: "team" as const },
  // Fun & chaos
  { id: "firstScorer", label: "🥇 First goal scorer of the tournament", points: 20, type: "text" as const },
  { id: "firstEliminated", label: "💀 First team to be eliminated", points: 10, type: "team" as const },
  { id: "firstOwnGoal", label: "🙈 First team to score an own goal", points: 10, type: "team" as const },
  { id: "firstRedCard", label: "🟥 First red card of the tournament", points: 10, type: "text" as const },
  { id: "hostSemis", label: "🇺🇸🇨🇦🇲🇽 Host nation reaches semis?", points: 15, type: "yesno" as const },
  { id: "debutantOut", label: "🎉 Debutant gets out of group stage?", points: 15, type: "yesno" as const },
  { id: "finalPens", label: "🎯 Penalty shootout in the final?", points: 15, type: "yesno" as const },
  { id: "woodenSpoon", label: "🥄 Wooden Spoon — last team with 0 group points", points: 10, type: "team" as const },
];

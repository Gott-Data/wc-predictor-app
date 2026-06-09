# ⚽ World Cup 2026 — Predictor App Spec

> **Scope:** A gamified prediction app for friends. Users need individual logins, can submit predictions per tournament phase, earn points for accuracy, and compete on a leaderboard. Live scores are fetched from a public API and used to auto-grade predictions.

---

## 1. Tournament Data

### Format
- **Teams:** 48, split into **12 groups (A–L)** of 4 teams each
- **Total matches:** 104
- **Dates:** June 11 – July 19, 2026
- **Hosts:** USA, Canada, Mexico (16 venues)
- **Knockout format:** Round of 32 → Round of 16 → Quarterfinals → Semifinals → Final

### Group Stage Advancement
- Top 2 from each group advance automatically (24 teams)
- Best 8 third-place teams also advance (8 teams)
- Total: **32 teams** enter knockout stage

---

## 2. All 12 Groups

| Group | Teams |
|-------|-------|
| **A** | Mexico 🇲🇽, South Africa 🇿🇦, South Korea 🇰🇷, Czechia 🇨🇿 |
| **B** | Canada 🇨🇦, Bosnia-Herzegovina 🇧🇦, Qatar 🇶🇦, Switzerland 🇨🇭 |
| **C** | Brazil 🇧🇷, Morocco 🇲🇦, Haiti 🇭🇹, Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 |
| **D** | United States 🇺🇸, Paraguay 🇵🇾, Australia 🇦🇺, Türkiye 🇹🇷 |
| **E** | Germany 🇩🇪, Curaçao 🇨🇼, Ivory Coast 🇨🇮, Ecuador 🇪🇨 |
| **F** | Netherlands 🇳🇱, Japan 🇯🇵, Sweden 🇸🇪, Tunisia 🇹🇳 |
| **G** | Belgium 🇧🇪, Egypt 🇪🇬, Iran 🇮🇷, New Zealand 🇳🇿 |
| **H** | Spain 🇪🇸, Cape Verde 🇨🇻, Saudi Arabia 🇸🇦, Uruguay 🇺🇾 |
| **I** | France 🇫🇷, Senegal 🇸🇳, Iraq 🇮🇶, Norway 🇳🇴 |
| **J** | Argentina 🇦🇷, Algeria 🇩🇿, Austria 🇦🇹, Jordan 🇯🇴 |
| **K** | Portugal 🇵🇹, Congo DR 🇨🇩, Uzbekistan 🇺🇿, Colombia 🇨🇴 |
| **L** | England 🏴󠁧󠁢󠁥󠁮󠁧󠁿, Croatia 🇭🇷, Ghana 🇬🇭, Panama 🇵🇦 |

### Key "Group of Death" Notes
- **Group H:** Spain (#1 FIFA) vs Uruguay — top contenders from opposing pathways
- **Group I:** France (#3 FIFA) vs Senegal & Norway — loaded group
- **Group J:** Argentina (defending champions, #2 FIFA)
- **Group K:** Portugal vs Colombia — both strong favorites

---

## 3. Knockout Stage Structure

```
Round of 32 (June 28 – July 2) — 16 matches
    ↓
Round of 16 (July 4–7) — 8 matches  [US venues only from here]
    ↓
Quarterfinals (July 9–10) — 4 matches
    ↓
Semifinals (July 14–15) — 2 matches
    ↓
Third-Place Play-off (July 18)
    ↓
FINAL — July 19, MetLife Stadium, New Jersey
```

**Pathway system:** Spain/Argentina and France/England are in separate brackets — they cannot meet before the semifinals.

---

## 4. Prediction Windows (Phases)

The app unlocks predictions at the start of each phase and locks them when the phase begins.

| Phase | Unlock | Lock | Predictions |
|-------|--------|------|-------------|
| Group Stage | App launch | June 11 kickoff | All 72 group matches |
| Round of 32 | After group stage ends (June 28) | First R32 match kicks off | 16 matches |
| Round of 16 | After R32 ends | First R16 match kicks off | 8 matches |
| Quarterfinals | After R16 ends | First QF kicks off | 4 matches |
| Semifinals | After QFs end | First SF kicks off | 2 matches |
| Final | After SFs end | Final kickoff | 1 match |
| **Tournament Specials** | App launch | June 11 kickoff | See Section 6 |

---

## 5. Scoring System

### Per-Match Predictions

Each user predicts: **Home Goals – Away Goals** (e.g., `2–1`)

| Result | Points |
|--------|--------|
| Exact scoreline (e.g., predicted 2–1, result 2–1) | **10 pts** |
| Correct goalscorer count for one team | **+2 pts** (bonus, stackable) |
| Correct result + correct total goals (not exact score) | **6 pts** |
| Correct result only (Win/Draw/Loss) | **3 pts** |
| Wrong result | **0 pts** |

**Knockout stage multipliers:**
- Round of 32: ×1
- Round of 16: ×1.5
- Quarterfinals: ×2
- Semifinals: ×3
- Final: ×4

**Example:** Predict exact score in the Final → 10 × 4 = **40 pts**

### Bonus Points
| Bonus | Points |
|-------|--------|
| Predict a 0–0 draw correctly | +5 pts (clean sheet bonus) |
| Predict an upset (lower-ranked team wins, per FIFA ranking) | +5 pts if correct |
| Predict extra time / penalties correctly in knockout | +3 pts |
| Weekly "Power Pick" — one match where points double | Doubles match score |

---

## 6. Tournament Special Predictions ("The Big Board")

Unlocked at app launch, locked at June 11 kickoff. These are one-time tournament predictions.

### 🏆 Core Awards
| Prediction | Points if Correct |
|------------|------------------|
| Tournament Winner | 25 pts |
| Runner-up | 15 pts |
| Third Place | 10 pts |
| Top Scorer (Golden Boot) | 20 pts |
| Best Goalkeeper (Golden Glove) | 15 pts |
| Best Player (Golden Ball) | 15 pts |
| Best Young Player (Best U21 award) | 15 pts |

### 📊 Tournament Stats
| Prediction | Points if Correct |
|------------|------------------|
| Total goals scored (within ±5) | 10 pts |
| Total goals scored (within ±10) | 5 pts |
| Number of hat-tricks in tournament (exact) | 15 pts |
| Number of red cards in tournament (exact) | 10 pts |
| Team with most clean sheets | 10 pts |
| Highest-scoring match (predict teams + score) | 20 pts |
| Most goals by a single player | 15 pts |

### 🎉 Fun & Chaos Predictions
| Prediction | Points if Correct |
|------------|------------------|
| First goal scorer of the entire tournament | 20 pts |
| First team to be eliminated | 10 pts |
| First team to score an own goal | 10 pts |
| First red card of the tournament | 10 pts |
| A host nation (USA/Canada/Mexico) reaches the semifinals | 15 pts |
| A debutant nation (Cape Verde, Curaçao, Haiti, Jordan, Uzbekistan) gets out of the group stage | 15 pts |
| Penalty shootout in the final | 15 pts |
| A group stage match ends 0–0 (predict which one) | 20 pts |
| Predict the exact number of penalties missed in the tournament | 15 pts |
| "Wooden Spoon" — last team standing with 0 points in group stage | 10 pts |

---

## 7. App Architecture Overview

### Tech Stack (Recommended)
- **Frontend:** React (or Next.js for SSR) with Tailwind CSS
- **Backend:** Node.js / Express or Next.js API routes
- **Database:** PostgreSQL (users, predictions, scores) or Firebase Firestore
- **Auth:** Auth0, Supabase Auth, or Firebase Authentication
- **Live Data:** [API-Football](https://www.api-football.com/) or [football-data.org](https://www.football-data.org/) for live scores
- **Score calculation:** Cron job or webhook after each match ends

### Data Models

#### `users`
```
id, username, email, avatar_emoji, created_at, total_points, streak
```

#### `predictions`
```
id, user_id, match_id, home_goals, away_goals, power_pick (bool), submitted_at, locked_at
```

#### `tournament_predictions`
```
id, user_id, category (e.g. "top_scorer"), value (e.g. "Mbappe"), submitted_at
```

#### `matches`
```
id, phase, group, home_team, away_team, kickoff_time, home_score, away_score, status (scheduled/live/finished), extra_time (bool), penalties (bool)
```

#### `leaderboard_snapshots`
```
id, user_id, phase, points_earned_this_phase, total_points, rank, timestamp
```

---

## 8. User Auth & Login

- Each user needs a **unique account** (email + password, or social login via Google/Apple)
- Users can set a **display name** and **avatar emoji** (keep it fun)
- No personal info beyond what's needed for auth
- Consider an **invite-only link** so only your friends group can join (no public signups)

### Invite Flow
1. Admin creates a shareable invite link (with a secret token)
2. Friends sign up only via that link
3. Admin can revoke/regenerate the link

---

## 9. Leaderboard & Gamification

### Leaderboard Views
- **Overall** — all-time total points
- **This phase** — points earned in current phase only
- **Group stage** — historical snapshot
- **Head-to-head** — compare two users side-by-side

### Badges / Achievements
| Badge | Trigger |
|-------|---------|
| 🎯 Sharpshooter | 3 exact scorelines in a row |
| 🔮 Oracle | Correct result in 10+ consecutive matches |
| 😬 Brave | Predict an upset that comes true |
| 💀 Bottler | Predicted wrong result in last 5 matches |
| 🧱 Brick Wall | Correctly predict 3 clean sheets |
| ⚡ Power Predictor | Win 3 Power Picks in a row |
| 🏆 World Cup Champion | Correctly predict the winner |
| 🐣 Beginner's Luck | First prediction is an exact scoreline |

### Streak System
- Track consecutive correct result predictions
- Show flame emoji 🔥 and streak count on profile
- Bonus 5 pts if streak reaches 10

### "Pundit of the Week"
- After each matchday, display who earned the most points that day
- Show a leaderboard delta (↑3 / ↓1) next to each player's rank

---

## 10. Phase Transition Flow

```
1. Phase ends (e.g., Group Stage final whistle)
2. System grades all predictions, awards points
3. Leaderboard snapshot saved for that phase
4. "Phase Results" screen shows:
   - Who won the phase
   - Top prediction of the phase (e.g., most exact scores)
   - Funny "worst prediction" highlight
5. New phase unlocks:
   - Teams in knockout round are now known
   - Users get prediction window (24–48 hours before first match)
6. Lock predictions → matches begin → repeat
```

---

## 11. Notifications (Optional)

- Push / email reminders: "⏰ Predictions lock in 1 hour for the Round of 16!"
- Score updates: "✅ Your 2–1 prediction for Brazil vs Morocco was correct! +10 pts"
- Leaderboard: "🏅 You just overtook [friend] and are now 3rd overall"

---

## 12. UI Screens

| Screen | Description |
|--------|-------------|
| **Home / Dashboard** | Your points, rank, current phase, quick-submit for next match |
| **Make Predictions** | Card-per-match, score slider or text input, Power Pick toggle |
| **Big Board** | Tournament-wide special predictions (Section 6) |
| **Leaderboard** | Tabs: Overall / Phase / Head-to-head |
| **Match Centre** | Live scores, your prediction vs result |
| **Profile** | Stats, badges, streak, prediction history |
| **Admin Panel** | Invite management, manual score correction, phase control |

---

## 13. Notable Players to Seed in "Top Scorer" Picker

A curated shortlist for the top scorer prediction dropdown:

| Player | Country | Group |
|--------|---------|-------|
| Kylian Mbappé | France | I |
| Lionel Messi | Argentina | J |
| Erling Haaland | Norway | I |
| Vinicius Jr | Brazil | C |
| Harry Kane | England | L |
| Bukayo Saka | England | L |
| Lamine Yamal | Spain | H |
| Pedri | Spain | H |
| Jamal Musiala | Germany | E |
| Florian Wirtz | Germany | E |
| Rodri | Spain | H |
| Bruno Fernandes | Portugal | K |
| Romelu Lukaku | Belgium | G |
| Memphis Depay | Netherlands | F |
| Richarlison | Brazil | C |
| Patrik Schick | Czechia | A |

---

## 14. Fun "Side Bets" (Optional Bonus Module)

Low-stakes fun predictions that can be toggled on by the group admin:

- Which commentator says "It's coming home" most this tournament
- First player to do a knee-slide celebration
- First manager to get sent to the stands
- Number of VAR reviews in the final
- Which group has the most total goals
- Will there be a golden goal / extra time comeback?

These can award fun titles rather than points (e.g., "🎙️ Pundit of the Tournament").

---

## 15. Recommended Public APIs

| API | Free Tier | Notes |
|-----|-----------|-------|
| [football-data.org](https://www.football-data.org/) | Yes (rate limited) | Good for fixtures, results |
| [API-Football (RapidAPI)](https://www.api-football.com/) | 100 req/day free | Live scores, lineups, stats |
| [OpenLiga](https://api.openligadb.de/) | Free, no key needed | Limited to some leagues |

**Recommended:** `API-Football` via RapidAPI for live match data. Poll every 60s during live matches. Cache aggressively outside live windows.

---

## 16. Development Phases / Build Order

### Phase 1 — MVP (before June 11)
- [ ] User auth + invite system
- [ ] Static match data for all 72 group stage games
- [ ] Group stage prediction form
- [ ] Tournament special predictions (Big Board)
- [ ] Basic leaderboard

### Phase 2 — Group Stage Live
- [ ] Live score integration (API polling)
- [ ] Auto-grading of predictions
- [ ] Leaderboard with phase points
- [ ] Basic badges

### Phase 3 — Knockout Rounds
- [ ] Dynamic match generation (teams from group results)
- [ ] Phase transition logic
- [ ] Score multipliers
- [ ] Phase snapshots and "phase winner" celebration

### Phase 4 — Polish
- [ ] Notifications
- [ ] Badges and streaks
- [ ] Head-to-head comparison
- [ ] Mobile responsiveness
- [ ] Confetti animations on correct predictions 🎉

---

*Data compiled June 2026. All group assignments and team lists verified against official FIFA draw (December 5, 2025, Kennedy Center, Washington D.C.).*

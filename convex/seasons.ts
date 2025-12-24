import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

type TeamStats = {
  teamId: Id<"teams">;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export const getCurrSeason = query({
  args: {},
  handler: async ({ db }) => {
    const now = new Date();
    const month = now.getMonth(); //Current month
    const currSeason = month < 6 ? "Season 1" : "Season 2";

    const seasonDoc = await db
      .query("seasons")
      .filter((q) => q.eq(q.field("season"), currSeason))
      .first();

    if (!seasonDoc) throw new Error(`Season "${currSeason}" not found`);

    // console.log(`Current season ID: ${seasonDoc._id}`);

    return seasonDoc;
  },
});

export const getSeasonStandings = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const month = now.getMonth(); //Current month
    const currSeason = month < 6 ? "Season 1" : "Season 2";

    const seasonDoc = await ctx.db
      .query("seasons")
      .filter((q) => q.eq(q.field("season"), currSeason))
      .first();

    if (!seasonDoc) throw new Error(`Season "${currSeason}" not found`);
    // console.log(`Current season: ${currSeason}, Season Id: ${seasonDoc._id}`);

    const seasonId = seasonDoc._id;

    // 1. Get all matches in this season
    const matches = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("season"), seasonId))
      .collect();

    // if (matches.length === 0) console.log("No matches found!");

    // 2. Stats object indexed by teamId
    const stats: Record<Id<"teams">, TeamStats> = {};

    const initTeam = (teamId: Id<"teams">) => {
      if (!stats[teamId]) {
        stats[teamId] = {
          teamId,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      }
    };

    // 3. Process each match
    for (const match of matches) {
      const { homeTeamId, awayTeamId, homeScore, awayScore } = match;

      // Skip match if not played
      if (homeScore == null || awayScore == null) continue;

      initTeam(homeTeamId);
      initTeam(awayTeamId);

      // Update played
      stats[homeTeamId].played++;
      stats[awayTeamId].played++;

      // Goals
      stats[homeTeamId].goalsFor += homeScore;
      stats[homeTeamId].goalsAgainst += awayScore;

      stats[awayTeamId].goalsFor += awayScore;
      stats[awayTeamId].goalsAgainst += homeScore;

      // Determine result
      if (homeScore > awayScore) {
        stats[homeTeamId].wins++;
        stats[homeTeamId].points += 3;
        stats[awayTeamId].losses++;
      } else if (awayScore > homeScore) {
        stats[awayTeamId].wins++;
        stats[awayTeamId].points += 3;
        stats[homeTeamId].losses++;
      } else {
        stats[homeTeamId].draws++;
        stats[awayTeamId].draws++;
        stats[homeTeamId].points++;
        stats[awayTeamId].points++;
      }
    }

    // 4. Compute goal difference
    Object.values(stats).forEach((t) => {
      t.goalDifference = t.goalsFor - t.goalsAgainst;
    });

    // 5. Sort table (common league rules)
    const standings = Object.values(stats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    // Optionally fetch team names
    const withTeamDetails = await Promise.all(
      standings.map(async (row) => ({
        ...row,
        team: await ctx.db.get(row.teamId),
      }))
    );

    // console.log("Details: " + withTeamDetails[0].goalDifference);
    return withTeamDetails;
  },
});

export const getMatchesBySeason = query({
  args: {},
  handler: async ({ db }) => {
    const now = new Date();
    const month = now.getMonth(); //Current month
    const currSeason = month < 6 ? "Season 1" : "Season 2";

    const seasonDoc = await db
      .query("seasons")
      .filter((q) => q.eq(q.field("season"), currSeason))
      .first();

    if (!seasonDoc) throw new Error(`Season "${currSeason}" not found`);

    const seasonId = seasonDoc._id;

    // Fetch matches for the given season
    const matches = await db
      .query("matches")
      .filter((q) => q.eq(q.field("season"), seasonId))
      .collect();

    // Collect all unique team IDs
    const teamIds = Array.from(new Set(matches.flatMap((m) => [m.homeTeamId, m.awayTeamId])));

    // Fetch all relevant teams
    const teamsArray = await Promise.all(teamIds.map((id) => db.get(id)));
    const teamsMap: Record<string, any> = {};

    teamsArray.forEach((team) => {
      if (team) teamsMap[team._id] = team.name;
    });

    // Map matches to include team details
    const matchesWithTeams = matches.map((m) => ({
      ...m,
      homeTeamName: teamsMap[m.homeTeamId] || null,
      awayTeamName: teamsMap[m.awayTeamId] || null,
    }));

    return matchesWithTeams;
  },
});

export const addMatchDetails = mutation({
  args: {
    homeTeamId: v.id("teams"),
    awayTeamId: v.id("teams"),
    homeScore: v.optional(v.number()),
    awayScore: v.optional(v.number()),
    date: v.optional(v.string()),
    seasonId: v.id("seasons"), // Inject the current season from frontend/backend
  },
  handler: async ({ db }, { homeTeamId, awayTeamId, homeScore, awayScore, date, seasonId }) => {
    try {
      const match = await db.insert("matches", {
        homeTeamId,
        awayTeamId,
        season: seasonId,
        homeScore,
        awayScore,
        date,
      });

      return match;
    } catch (error) {
      console.log("Failed: " + error);
    }
  },
});

export const addGoalEvent = mutation({
  args: {
    matchId: v.id("matches"),
    teamId: v.id("teams"),
    scorerId: v.id("players"),
    goalType: v.union(v.literal("normal"), v.literal("own_goal"), v.literal("penalty")),
    assisterId: v.optional(v.id("players")),
  },

  handler: async (ctx, args) => {
    const monthMap: Record<string, number> = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = now.getMonth() + 1;

    // Fetch current year
    const yearDoc = await ctx.db
      .query("years")
      .filter((q) => q.eq(q.field("year"), currentYear))
      .first();

    if (!yearDoc) return null;

    // Fetch seasons
    const seasons = await ctx.db
      .query("seasons")
      .filter((q) => q.eq(q.field("yearId"), yearDoc._id))
      .collect();

    // Determine current season
    const currSeason = seasons.find((s) => {
      const start = monthMap[s.startMonth ?? "January"];
      const end = monthMap[s.endMonth ?? "December"];

      return currentMonth >= start && currentMonth <= end;
    });

    if (!currSeason) return null;

    const { matchId, teamId, scorerId, goalType, assisterId } = args;

    const match = await ctx.db.get(matchId);
    if (!match) throw new Error("Match does not exist.");

    // Ensure goal belongs to the correct season
    if (match.season !== currSeason._id) {
      throw new Error("This match does not belong to the selected season.");
    }

    // Team must exist and be part of this match
    const team = await ctx.db.get(teamId);
    if (!team) throw new Error("Team does not exist.");

    if (teamId !== match.homeTeamId && teamId !== match.awayTeamId) {
      throw new Error("This goal's team is not part of the match.");
    }

    // Validate scorer
    const scorer = await ctx.db.get(scorerId);
    if (!scorer) throw new Error("Scorer does not exist.");

    // Validate assister if included
    if (assisterId) {
      const assister = await ctx.db.get(assisterId);

      if (!assister) throw new Error("Assister does not exist.");
    }

    // --- INSERT INTO TABLE ---
    const insertedId = await ctx.db.insert("goalEvents", {
      matchId,
      teamId,
      scorerId,
      goalType,
      assisterId,
      seasonId: currSeason._id,
    });

    return { insertedId };
  },
});

// export const getCurrentMatchResult = query({
//   args: {},
//   handler: async ({ db }) => {
//     // 1. Determine the current season
//     const now = new Date();
//     const month = now.getMonth();
//     const currSeasonName = month < 6 ? "Season 1" : "Season 2";

//     const seasonDoc = await db
//       .query("seasons")
//       .filter((q) => q.eq(q.field("season"), currSeasonName))
//       .first();

//     if (!seasonDoc) throw new Error(`Season "${currSeasonName}" not found`);

//     // 2. Get matches for this season
//     let matches = await db
//       .query("matches")
//       .filter((q) => q.eq(q.field("season"), seasonDoc._id))
//       .collect();

//     if (matches.length === 0) return null;

//     // 3. Sort matches by date (descending)
//     matches.sort((a, b) => {
//       if (!a.date || !b.date) return 0;
//       return new Date(b.date).getTime() - new Date(a.date).getTime();
//     });

//     const latestMatch = matches[0];

//     // console.log(matches);
//     // 4. Get team names (optional but helpful)
//     const homeTeam = await db.get(latestMatch.homeTeamId);
//     const awayTeam = await db.get(latestMatch.awayTeamId);

//     return {
//       ...latestMatch,
//       homeTeamName: homeTeam?.name ?? "Unknown",
//       awayTeamName: awayTeam?.name ?? "Unknown",
//       seasonName: seasonDoc.season,
//     };
//   },
// });

export const getCurrentMatchDetails = query(async ({ db }) => {
  const monthMap: Record<string, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = now.getMonth() + 1;

  // Fetch current year
  const yearDoc = await db
    .query("years")
    .filter((q) => q.eq(q.field("year"), currentYear))
    .first();

  if (!yearDoc) return null;

  // Fetch seasons
  const seasons = await db
    .query("seasons")
    .filter((q) => q.eq(q.field("yearId"), yearDoc._id))
    .collect();

  // Determine current season
  const currentSeason = seasons.find((s) => {
    const start = monthMap[s.startMonth ?? "January"];
    const end = monthMap[s.endMonth ?? "December"];
    return currentMonth >= start && currentMonth <= end;
  });

  if (!currentSeason) return null;

  // Fetch matches in current season
  const matches = await db
    .query("matches")
    .filter((q) => q.eq(q.field("season"), currentSeason._id))
    .collect();

  const sortedMatches = matches.filter((m) => m.date).sort((a, b) => (a.date! < b.date! ? 1 : -1));

  const currentMatch = sortedMatches[0];
  if (!currentMatch) return null;

  // Teams
  const homeTeam = await db.get(currentMatch.homeTeamId);
  const awayTeam = await db.get(currentMatch.awayTeamId);

  // Goals
  const goalEvents = await db
    .query("goalEvents")
    .filter((q) => q.eq(q.field("matchId"), currentMatch._id))
    .collect();

  // Players cache
  const playersMap: Record<string, string> = {};

  async function getPlayerName(id: Id<"players"> | null) {
    if (!id) return null;

    if (playersMap[id]) return playersMap[id];

    const p = await db.get(id);

    playersMap[id] = p?.name ?? "";

    return playersMap[id];
  }

  // Split goals
  const homeGoals = goalEvents.filter((g) => g.teamId === currentMatch.homeTeamId);
  const awayGoals = goalEvents.filter((g) => g.teamId === currentMatch.awayTeamId);

  // Bookings
  const bookings = await db
    .query("bookings")
    .withIndex("by_matchId", (q) => q.eq("matchId", currentMatch._id))
    .collect();

  const homeBookings = bookings.filter((b) => b.teamId === currentMatch.homeTeamId);
  const awayBookings = bookings.filter((b) => b.teamId === currentMatch.awayTeamId);

  // Build final result
  return {
    date: currentMatch.date,
    homeTeam: {
      tname: homeTeam?.name ?? "",
      score: currentMatch.homeScore ?? 0,
      gc: await Promise.all(
        homeGoals.map(async (g) => ({
          scorer: await getPlayerName(g.scorerId),
          assister: g.assisterId ? await getPlayerName(g.assisterId) : null,
          gtype: g.goalType,
        }))
      ),
      bookings: await Promise.all(
        homeBookings.map(async (b) => ({
          book: await getPlayerName(b.playerId),
          ctype: b.cardType ?? [],
        }))
      ),
    },
    awayTeam: {
      tname: awayTeam?.name ?? "",
      score: currentMatch.awayScore ?? 0,
      gc: await Promise.all(
        awayGoals.map(async (g) => ({
          scorer: await getPlayerName(g.scorerId),
          assister: g.assisterId ? await getPlayerName(g.assisterId) : null,
          gtype: g.goalType,
        }))
      ),
      bookings: await Promise.all(
        awayBookings.map(async (b) => ({
          book: await getPlayerName(b.playerId),
          ctype: b.cardType ?? [],
        }))
      ),
    },
  };
});

// export const getSeasonsByYear = query({
//   args: { yearId: v.id("years") },
//   handler: async (ctx, { yearId }) => {
//     const seasons = await ctx.db.query("seasons").withIndex("by_yearId").collect();

//     // Filter seasons by the yearId
//     return seasons.filter((season) => season.yearId === yearId);
//   },
// });

export const getAllYears = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query("years").collect();
  },
});

export const getYearByName = query({
  args: { year: v.string() },
  handler: async (ctx, { year }) => {
    return ctx.db
      .query("years")
      .filter((f) => f.eq(f.field("year"), year))
      .first();
  },
});

export const getSeasonsByYear = query({
  args: { yearId: v.id("years") },
  handler: async (ctx, { yearId }) => {
    return await ctx.db
      .query("seasons")
      .withIndex("by_yearId")
      .filter((f) => f.eq(f.field("yearId"), yearId))
      .collect();
  },
});

// convex/standings.ts

export const getTopStatsBySeason = query({
  args: { seasonId: v.id("seasons") },
  handler: async (ctx, { seasonId }) => {
    // 1) Fetch goal events for this season
    const goalEvents = await ctx.db
      .query("goalEvents")
      .withIndex("by_season", (q) => q.eq("seasonId", seasonId))
      .collect();

    // 2) Tally scorers & assisters
    const scorerCounts: Record<string, number> = {};
    const assisterCounts: Record<string, number> = {};

    for (const g of goalEvents) {
      // count scorer
      if (g.scorerId) {
        scorerCounts[g.scorerId] = (scorerCounts[g.scorerId] ?? 0) + 1;
      }
      // count assister (optional)
      if (g.assisterId) {
        assisterCounts[g.assisterId] = (assisterCounts[g.assisterId] ?? 0) + 1;
      }
    }

    // 3) Convert to sorted arrays and take top 5
    const topScorersRaw = Object.entries(scorerCounts)
      .map(([playerId, count]) => ({ playerId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topAssistersRaw = Object.entries(assisterCounts)
      .map(([playerId, count]) => ({ playerId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Helper to enrich a playerId with name + team (first link)
    const enrichPlayer = async (playerId: string) => {
      const player = await ctx.db.get(playerId as Id<"players">);

      if (!player) return null;

      // Get first playersTeams link (assumes latest/only)
      const playerTeamLink = await ctx.db
        .query("playersTeams")
        .withIndex("by_playerId", (q) => q.eq("playerId", playerId as any))
        .first();

      const teamName =
        playerTeamLink ? ((await ctx.db.get(playerTeamLink.teamId))?.name ?? null) : null;

      return {
        playerName: player.name,
        team: teamName,
      };
    };

    // 4) Enrich top scorers (in parallel)
    const topScorers = (
      await Promise.all(
        topScorersRaw.map(async (s) => {
          const info = await enrichPlayer(s.playerId);

          if (!info) return null;

          return {
            playerName: info.playerName,
            numOfGoals: s.count,
            team: info.team,
          };
        })
      )
    ).filter(Boolean);

    // 5) Enrich top assisters (in parallel)
    const assistProviders = (
      await Promise.all(
        topAssistersRaw.map(async (a) => {
          const info = await enrichPlayer(a.playerId);

          if (!info) return null;

          return {
            playerName: info.playerName,
            numOfAssist: a.count,
            team: info.team,
          };
        })
      )
    ).filter(Boolean);

    return {
      topScorers,
      assistProviders,
    };
  },
});

// Internal query: compute flattened standings for one season
export const getStandings = query({
  args: { seasonId: v.id("seasons") },
  handler: async (ctx, { seasonId }) => {
    const matches = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("season"), seasonId))
      .collect();

    const table = new Map<string, any>();

    const ensure = (teamId: string) => {
      if (!table.has(teamId)) {
        table.set(teamId, {
          teamId,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        });
      }
      return table.get(teamId)!;
    };

    for (const match of matches) {
      if (match.homeScore === undefined || match.awayScore === undefined) continue;

      const home = ensure(match.homeTeamId);
      const away = ensure(match.awayTeamId);

      home.played++;
      away.played++;

      home.goalsFor += match.homeScore;
      home.goalsAgainst += match.awayScore;

      away.goalsFor += match.awayScore;
      away.goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        home.wins++;
        home.points += 3;
        away.losses++;
      } else if (match.homeScore < match.awayScore) {
        away.wins++;
        away.points += 3;
        home.losses++;
      } else {
        home.draws++;
        away.draws++;
        home.points++;
        away.points++;
      }
    }

    const rows = Array.from(table.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goalsFor - a.goalsAgainst;
      const gdB = b.goalsFor - b.goalsAgainst;
      if (gdB !== gdA) return gdB - gdA;
      return b.goalsFor - a.goalsFor;
    });

    // Flatten with team name
    return Promise.all(
      rows.map(async (row, index) => {
        // cast to only the team type
        const team = (await ctx.db.get(row.teamId)) as { name: string } | null;

        return {
          position: index + 1,
          team: team?.name ?? "Unknown",
          played: row.played,
          wins: row.wins,
          draws: row.draws,
          losses: row.losses,
          goalsFor: row.goalsFor,
          goalsAgainst: row.goalsAgainst,
          goalDifference: row.goalsFor - row.goalsAgainst,
          points: row.points,
        };
      })
    );
  },
});

// Internal query: get top scorer and top assister with team
export const getSeasonTopStats = query({
  args: { seasonId: v.id("seasons") },
  handler: async (ctx, { seasonId }) => {
    const events = await ctx.db
      .query("goalEvents")
      .withIndex("by_season", (q) => q.eq("seasonId", seasonId))
      .collect();

    const scorers = new Map<string, number>();
    const assisters = new Map<string, number>();

    for (const e of events) {
      scorers.set(e.scorerId, (scorers.get(e.scorerId) ?? 0) + 1);
      if (e.assisterId) assisters.set(e.assisterId, (assisters.get(e.assisterId) ?? 0) + 1);
    }

    const season = await ctx.db.get(seasonId);
    if (!season) return { topScorer: null, topAssister: null };

    const topScorerEntry = [...scorers.entries()].sort((a, b) => b[1] - a[1])[0];
    const topAssisterEntry = [...assisters.entries()].sort((a, b) => b[1] - a[1])[0];

    const getPlayerTeam = async (playerId: Id<"players">) => {
      const playerTeam = await ctx.db
        .query("playersTeams")
        .withIndex("by_playerId", (q) => q.eq("playerId", playerId))
        .filter((q) => q.eq(q.field("yearId"), season.yearId))
        .first();

      if (!playerTeam) return null;

      const team = await ctx.db.get(playerTeam.teamId);

      return team;
    };

    let topScorer = null;
    let topAssister = null;

    if (topScorerEntry) {
      const playerId = topScorerEntry[0] as Id<"players">;
      const player = await ctx.db.get(playerId);

      if (player) {
        const team = await getPlayerTeam(player._id);
        topScorer = player && team ? { player: player.name, team: team.name } : null;
      }
    }

    if (topAssisterEntry) {
      const playerId = topAssisterEntry[0] as Id<"players">;
      const player = await ctx.db.get(playerId);

      if (player) {
        const team = await getPlayerTeam(player?._id);
        topAssister = player && team ? { player: player.name, team: team.name } : null;
      }
    }

    return { topScorer, topAssister };
  },
});

// Public query: final overview for a year
export const getYearOverview = query({
  args: { yearId: v.id("years") },
  handler: async (ctx, { yearId }) => {
    const seasons = await ctx.db
      .query("seasons")
      .withIndex("by_yearId", (q) => q.eq("yearId", yearId))
      .collect();

    const result: Record<string, any> = {};

    for (const season of seasons) {
      const standings = await ctx.runQuery(api.seasons.getStandings, {
        seasonId: season._id,
      });

      const topStats = await ctx.runQuery(api.seasons.getSeasonTopStats, {
        seasonId: season._id,
      });

      // console.log(topStats);

      result[season.season] = {
        standings,
        topScorer: topStats.topScorer,
        topAssister: topStats.topAssister,
      };
    }

    return result;
  },
});

// export const getCurrentMatchDetails = query(async ({ db }) => {
//   const monthMap: Record<string, number> = {
//     January: 1,
//     February: 2,
//     March: 3,
//     April: 4,
//     May: 5,
//     June: 6,
//     July: 7,
//     August: 8,
//     September: 9,
//     October: 10,
//     November: 11,
//     December: 12,
//   };

//   const now = new Date();
//   const currentYear = now.getFullYear().toString();
//   const currentMonth = now.getMonth() + 1; // 1–12

//   const yearDoc = await db
//     .query("years")
//     .filter((q) => q.eq(q.field("year"), currentYear))
//     .first();

//   if (!yearDoc) return null;

//   const seasons = await db
//     .query("seasons")
//     .filter((q) => q.eq(q.field("yearId"), yearDoc._id))
//     .collect();

//   const currentSeason = seasons.find((s) => {
//     const start = monthMap[s.startMonth ?? "January"];
//     const end = monthMap[s.endMonth ?? "December"];

//     return currentMonth >= start && currentMonth <= end;
//   }) as Doc<"seasons"> | undefined;

//   if (!currentSeason) return null;

//   // console.log(currentSeason);

//   const matches = await db
//     .query("matches")
//     .filter((q) => q.eq(q.field("season"), currentSeason._id))
//     .collect();

//   const sortedMatches = matches
//     .filter((m) => m.date) // ensure date exists
//     .sort((a, b) => (a.date! < b.date! ? 1 : -1)); // latest first

//   const currentMatch = sortedMatches[0] as Doc<"matches"> | undefined;

//   if (!currentMatch) return null;

//   const homeTeam = (await db.get(currentMatch.homeTeamId)) as Doc<"teams">;
//   const awayTeam = (await db.get(currentMatch.awayTeamId)) as Doc<"teams">;

//   const goalEvents = (await db
//     .query("goalEvents")
//     .filter((q) => q.eq(q.field("matchId"), currentMatch._id))
//     .collect()) as Doc<"goalEvents">[];

//   const playersMap: Record<Id<"players">, { name: string; teamName: string | null }> = {};

//   for (const ge of goalEvents) {
//     // Scorer
//     if (!playersMap[ge.scorerId]) {
//       const player = (await db.get(ge.scorerId)) as Doc<"players"> | null;

//       if (player) {
//         const playerTeamLink = await db
//           .query("playersTeams")
//           .withIndex("by_playerId", (q) => q.eq("playerId", ge.scorerId))
//           .first();

//         const team = playerTeamLink ? await db.get(playerTeamLink.teamId) : null;

//         playersMap[ge.scorerId] = { name: player.name, teamName: team?.name ?? null };
//       }
//     }

//     if (ge.assisterId && !playersMap[ge.assisterId]) {
//       const assister = (await db.get(ge.assisterId)) as Doc<"players"> | null;

//       if (assister) {
//         const playerTeamLink = await db
//           .query("playersTeams")
//           .withIndex("by_playerId", (q) => q.eq("playerId", ge.assisterId!))
//           .first();

//         const team = playerTeamLink ? await db.get(playerTeamLink.teamId) : null;

//         playersMap[ge.assisterId] = { name: assister.name, teamName: team?.name ?? null };
//       }
//     }
//   }

//   const goalDetails = goalEvents.map((ge) => ({
//     scorerId: ge.scorerId,
//     scorerName: playersMap[ge.scorerId]?.name ?? "",
//     scorerTeam: playersMap[ge.scorerId]?.teamName ?? null,
//     assisterId: ge.assisterId ?? null,
//     assisterName: ge.assisterId ? (playersMap[ge.assisterId]?.name ?? "") : null,
//     assisterTeam: ge.assisterId ? (playersMap[ge.assisterId]?.teamName ?? null) : null,
//   }));

//   const bookings = (await db
//     .query("bookings")
//     .withIndex("by_matchId", (q) => q.eq("matchId", currentMatch._id))
//     .collect()) as Doc<"bookings">[];

//   const bookingDetails = bookings.map(async (b) => {
//     const player = (await db.get(b.playerId)) as Doc<"players"> | null;

//     const playerTeamLink =
//       player ?
//         await db
//           .query("playersTeams")
//           .withIndex("by_playerId", (q) => q.eq("playerId", b.playerId))
//           .first()
//       : null;

//     const team = playerTeamLink ? await db.get(playerTeamLink.teamId) : null;

//     return {
//       playerId: b.playerId,
//       playerName: player?.name ?? "",
//       teamName: team?.name ?? null,
//       cardType: b.cardType,
//     };
//   });

//   const mDetails = {
//     matchId: currentMatch._id,
//     date: currentMatch.date ?? null,
//     homeTeam: {
//       id: currentMatch.homeTeamId,
//       name: homeTeam.name,
//       score: currentMatch.homeScore ?? 0,
//     },
//     awayTeam: {
//       id: currentMatch.awayTeamId,
//       name: awayTeam.name,
//       score: currentMatch.awayScore ?? 0,
//     },
//     goals: goalDetails,
//     bookings: bookingDetails,
//   };

//   // console.log("juk: " + mDetails);

//   return mDetails;
// });

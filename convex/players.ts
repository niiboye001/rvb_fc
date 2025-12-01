import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addPlayer = mutation({
  args: { name: v.string(), phone: v.union(v.string(), v.null()) },
  handler: async (context, { name, phone }) => {
    const playerId = await context.db.insert("players", { name, phone: phone ?? "" });

    return playerId;
  },
});

export const getPlayers = query({
  handler: async (context) => {
    const players = await context.db.query("players").order("desc").collect();

    const results = await Promise.all(
      players.map(async (player) => {
        const playerTeam = await context.db
          .query("playersTeams")
          .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
          .unique();

        if (!playerTeam) {
          return { ...player, team: null };
        }

        const team = await context.db.get(playerTeam.teamId);

        return { ...player, team };
      })
    );

    return results.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const updatePlayer = mutation({
  args: { id: v.id("players"), name: v.string(), phone: v.string() },
  handler: async (context, args) => {
    const updated = await context.db.patch(args.id, { name: args.name, phone: args.phone });

    return args.id;
  },
});

// ASSIGN PLAYER TO TEAM
export const AssignPlayerToTeam = mutation({
  args: { playerId: v.id("players"), teamId: v.id("teams") },
  handler: async ({ db }, { playerId, teamId }) => {
    const currYear = new Date().getFullYear().toString();

    const currYearDetails = await db
      .query("years")
      .filter((q) => q.eq(q.field("year"), currYear))
      .first();

    if (!currYearDetails?.teamIds.includes(teamId)) {
      throw new Error("No year found for this team");
    }

    // 2. Find if this player already has a team in this same year
    const existingRelation = await db
      .query("playersTeams")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("playerId"), playerId),
            q.eq(q.field("teamId"), teamId),
            q.eq(q.field("yearId"), currYearDetails.year)
          ),
          q.and(q.eq(q.field("playerId"), playerId), q.eq(q.field("yearId"), currYearDetails._id))
        )
      )
      .first();

    if (!existingRelation) {
      return await db.insert("playersTeams", {
        playerId: playerId,
        teamId: teamId,
        yearId: currYearDetails._id,
      });
    }

    return await db.patch(existingRelation._id, {
      teamId: teamId,
    });
  },
});

export const getTeamsWithPlayers = query({
  args: {},
  handler: async (context) => {
    const currYear = new Date().getFullYear().toString();

    const currYearDetails = await context.db
      .query("years")
      .filter((q) => q.eq(q.field("year"), currYear))
      .first();

    if (!currYearDetails) return;

    const teamSquad = await Promise.all(
      currYearDetails.teamIds.map(async (teamId) => {
        const playerLinks = await context.db
          .query("playersTeams")
          .withIndex("by_teamId", (q) => q.eq("teamId", teamId))
          .filter((q) => q.eq(q.field("yearId"), currYearDetails._id))
          .collect();

        const players = await Promise.all(playerLinks.map((link) => context.db.get(link.playerId)));
        return {
          team: await context.db.get(teamId),
          players: players.filter(Boolean),
        };
      })
    );

    return teamSquad;
  },
});

export const getTeamPlayers = query({
  args: {},
  handler: async (ctx) => {
    const currYear = new Date().getFullYear().toString();

    const currYearDetails = await ctx.db
      .query("years")
      .filter((q) => q.eq(q.field("year"), currYear))
      .first();

    if (!currYearDetails) return [];

    const rows = [];

    for (const teamId of currYearDetails.teamIds) {
      const team = await ctx.db.get(teamId);
      if (!team) continue;

      const playerLinks = await ctx.db
        .query("playersTeams")
        .withIndex("by_teamId", (q) => q.eq("teamId", teamId))
        .filter((q) => q.eq(q.field("yearId"), currYearDetails._id))
        .collect();

      const players = await Promise.all(playerLinks.map((l) => ctx.db.get(l.playerId)));

      for (const player of players) {
        if (!player) continue;

        rows.push({
          playerId: player._id,
          playerName: player.name,
          teamId: team._id,
          teamName: team.name,
        });
      }
    }

    rows.sort((a, b) => a.playerName.localeCompare(b.playerName));

    return rows;
  },
});

export const getCurrentMatchBookings = query({
  args: {},
  handler: async (ctx) => {
    // 1. Get all bookings sorted by creation time desc
    const bookings = await ctx.db.query("bookings").order("desc").collect();

    if (bookings.length === 0) return [];

    // 2. Determine the latest match by the most recent booking
    const latestMatchId = bookings[0].matchId;

    // 3. Get all bookings for that match
    const matchBookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("matchId"), latestMatchId))
      .collect();

    // console.log(matchBookings);

    const result = [];

    for (const booking of matchBookings) {
      const player = await ctx.db.get(booking.playerId);
      if (!player) continue;

      // Get team from playersTeams table
      const playersTeam = await ctx.db
        .query("playersTeams")
        .withIndex("by_playerId", (q) => q.eq("playerId", booking.playerId))
        .first();

      let teamName = null;
      if (playersTeam) {
        const team = await ctx.db.get(playersTeam.teamId);
        teamName = team?.name ?? null;
      }

      result.push({
        bookingId: booking._id,
        playerId: booking.playerId,
        playerName: player.name,
        teamName,
        cardType: booking.cardType,
      });
    }

    return result;
  },
});

// export const getBookingsForCurrentMatch = query({
//   args: {},

//   handler: async (ctx) => {
//     const { db } = ctx;

//     // Fetch all matches
//     const matches = await db.query("matches").collect();
//     if (matches.length === 0) return {};

//     // Sort matches by date (latest first)
//     const validMatches = matches.filter((m) => m.date);

//     if (validMatches.length === 0) return {};

//     // console.log(validMatches);

//     const sorted = validMatches.sort(
//       (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
//     );

//     const currentMatch = sorted[0];
//     const matchId = currentMatch._id;

//     // Fetch all bookings for this match
//     const bookings = await db
//       .query("bookings")
//       .withIndex("by_matchId", (q) => q.eq("matchId", matchId))
//       .collect();

//     if (bookings.length === 0) return {};

//     // Fetch only the players involved
//     const playerIds = [...new Set(bookings.map((b) => b.playerId))];

//     const players = await Promise.all(playerIds.map((id) => db.get(id)));

//     const playerNameMap = new Map(players.filter(Boolean).map((p) => [p!._id, p!.name]));
//     // console.log(playerNameMap);

//     // Build response grouped by player name
//     const result: Record<string, string[]> = {};

//     for (const b of bookings) {
//       const name = playerNameMap.get(b.playerId);
//       if (!name) continue;

//       if (!result[name]) {
//         result[name] = [];
//       }

//       result[name].push(b.cardType);
//     }

//     // console.log(result);

//     return result;
//   },
// });

// export const getAllPlayersWithTeams = query({
//   args: {},
//   handler: async ({ db }) => {
//     const allPlayers = await db.query("players").collect();

//     const playersWithTeams = await Promise.all(
//       allPlayers.map(async (player) => {
//         const link = await db
//           .query("playersTeams")
//           .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
//           .first();

//         let team = null;

//         if (link) {
//           team = await db.get(link.teamId);
//         }

//         if (!team?._id) {
//           return {
//             playerId: player._id,
//             playerName: player.name,
//           };
//         }

//         return {
//           playerId: player._id,
//           playerName: player.name,
//           teamId: team?._id ?? null,
//           teamName: team?.name ?? null,
//         };
//       })
//     );

//     playersWithTeams.sort((a, b) => a.playerName.localeCompare(b.playerName));

//     return playersWithTeams;
//   },
// });

// export const getTeamPlayers = query({
//   args: {},
//   handler: async (ctx) => {
//     const currYear = new Date().getFullYear().toString();

//     const currYearDetails = await ctx.db
//       .query("years")
//       .filter((q) => q.eq(q.field("year"), currYear))
//       .first();

//     if (!currYearDetails) return [];

//     const rows = [];

//     for (const teamId of currYearDetails.teamIds) {
//       const team = await ctx.db.get(teamId);
//       if (!team) continue;

//       const playerLinks = await ctx.db
//         .query("playersTeams")
//         .withIndex("by_teamId", (q) => q.eq("teamId", teamId))
//         .filter((q) => q.eq(q.field("yearId"), currYearDetails._id))
//         .collect();
//       // console.log(playerLinks);

//       if (!playerLinks) {
//         rows.push({});
//       } else {
//       }

//       const players = await Promise.all(playerLinks.map((l) => ctx.db.get(l.playerId)));

//       for (const player of players) {
//         if (!player) continue;

//         rows.push({
//           playerId: player._id,
//           playerName: player.name,
//           teamId: team._id || null,
//           teamName: team.name || null,
//         });
//       }
//     }

//     rows.sort((a, b) => a.playerName.localeCompare(b.playerName));

//     return rows;
//   },
// });

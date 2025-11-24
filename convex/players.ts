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
    // 1. Get the year document
    // const year = await context.db.get(yearId);
    // if (!year) return [];

    const currYear = new Date().getFullYear().toString();

    const currYearDetails = await context.db
      .query("years")
      .filter((q) => q.eq(q.field("year"), currYear))
      .first();

    // if (currYearDetails) {
    //   const currYearId = currYearDetails._id;
    // }

    if (!currYearDetails) return;

    // 2. Load all teams for that year
    const teamSquad = await Promise.all(
      currYearDetails.teamIds.map(async (teamId) => {
        // 3. Query the playersTeams table for players in this team & year
        const playerLinks = await context.db
          .query("playersTeams")
          .withIndex("by_teamId", (q) => q.eq("teamId", teamId))
          .filter((q) => q.eq(q.field("yearId"), currYearDetails._id))
          .collect();

        // 4. Fetch the actual player docs
        const players = await Promise.all(playerLinks.map((link) => context.db.get(link.playerId)));
        // console.log(players);
        return {
          team: await context.db.get(teamId),
          players: players.filter(Boolean), // remove nulls
        };
      })
    );

    // console.log(teamSquad);

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

    // 🔥 SORT BY PLAYER NAME
    rows.sort((a, b) => a.playerName.localeCompare(b.playerName));

    return rows;
  },
});

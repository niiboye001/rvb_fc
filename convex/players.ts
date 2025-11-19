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

// export const updatePlayerTeam = mutation({args: {teamId}});

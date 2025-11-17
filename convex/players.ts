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
    const isComboExisting = await db
      .query("playersTeams")
      .withIndex("playerId_teamId", (q) => q.eq("playerId", playerId).eq("teamId", teamId))
      .first();

    // if (isComboExisting) throw new Error("Player already belongs to this team.");
    if (isComboExisting) return "existing";

    const comboId = await db.insert("playersTeams", { playerId, teamId });

    return comboId;
  },
});

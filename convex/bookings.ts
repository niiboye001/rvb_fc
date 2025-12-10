import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Booking } from "./types";

export const addBooking = mutation({
  args: {
    matchId: v.id("matches"),
    playerId: v.id("players"),
    teamId: v.id("teams"),
    cardType: v.union(v.literal("yellow"), v.literal("second_yellow"), v.literal("red")),
  },

  handler: async (ctx, args): Promise<string> => {
    const { db } = ctx;

    const match = await db.get(args.matchId);
    if (!match) throw new Error("Match not found");

    const player = await db.get(args.playerId);
    if (!player) throw new Error("Player not found");

    const team = await db.get(args.teamId);
    if (!team) throw new Error("Team not found");

    const bookingId = await db.insert("bookings", {
      matchId: args.matchId,
      playerId: args.playerId,
      teamId: args.teamId,
      cardType: args.cardType,
    });

    return bookingId;
  },
});

export const getHasCard = query({
  args: {
    playerId: v.id("players"),
    matchId: v.id("matches"),
  },

  handler: async (ctx, args): Promise<Booking[]> => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_match_player", (q) =>
        q.eq("playerId", args.playerId).eq("matchId", args.matchId)
      )
      .collect();

    return bookings;
  },
});

import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addPlayer = mutation({
  args: { name: v.string(), phone: v.union(v.string(), v.null()) },
  handler: async (context, { name, phone }) => {
    await context.db.insert("players", { name, phone: phone ?? "" });
  },
});

export const getPlayers = mutation({
  handler: async (context) => {
    await context.db.query("players").collect();
  },
});

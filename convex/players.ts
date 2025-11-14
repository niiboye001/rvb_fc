import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addPlayer = mutation({
  args: { name: v.string(), phone: v.string() },
  handler: async (context, { name, phone }) => {
    await context.db.insert("players", { name, phone });
  },
});

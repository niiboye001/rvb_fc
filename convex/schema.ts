import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
  }),

  years: defineTable({
    year: v.string(),
    teamIds: v.array(v.id("teams")),
  }).index("teamIds", ["teamIds"]),

  seasons: defineTable({
    season: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    status: v.optional(v.string()),
    yearId: v.id("years"),
  }).index("by_yearId", ["yearId"]),

  players: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
  }),

  playersTeams: defineTable({
    playerId: v.id("players"),
    teamId: v.id("teams"),
    yearId: v.id("years"),
  })
    .index("playerId_teamId", ["playerId", "teamId"])
    .index("by_playerId", ["playerId"])
    .index("by_teamId", ["teamId"])
    .index("by_yearId", ["yearId"]),

  matches: defineTable({
    homeTeamId: v.id("teams"),
    awayTeamId: v.id("teams"),
    season: v.id("seasons"),
    date: v.optional(v.string()),
    homeScore: v.optional(v.number()),
    awayScore: v.optional(v.number()),
  }),

  stats: defineTable({
    playerId: v.id("players"),
    matchId: v.id("matches"),
    teamId: v.id("teams"),
    goals: v.optional(v.number()),
    assists: v.optional(v.number()),
  })
    .index("by_playerId", ["playerId"])
    .index("by_matchId", ["matchId"])
    .index("by_teamId", ["teamId"]),
});

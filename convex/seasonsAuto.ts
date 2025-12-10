import { internalMutation } from "./_generated/server";

const SEASON_DEFINITIONS = [
  { season: "Season 1", startMonth: "January", endMonth: "June" },
  { season: "Season 2", startMonth: "July", endMonth: "December" },
];

export const createIfNeeded = internalMutation(async (ctx) => {
  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "long" });

  // Does current month match any season start?
  const seasonDef = SEASON_DEFINITIONS.find((s) => s.startMonth === currentMonth);

  if (!seasonDef) return; // Not the beginning of any season

  // Get all years (these might represent leagues or groups of teams)
  const years = await ctx.db.query("years").collect();

  for (const year of years) {
    // Check if this season already exists for this year
    const existing = await ctx.db
      .query("seasons")
      .withIndex("by_yearId", (q) => q.eq("yearId", year._id))
      .filter((q) => q.eq(q.field("season"), seasonDef.season))
      .first();

    if (existing) continue; // Already created

    // Create the season
    await ctx.db.insert("seasons", {
      season: seasonDef.season,
      startMonth: seasonDef.startMonth,
      endMonth: seasonDef.endMonth,
      status: "upcoming",
      yearId: year._id,
    });
  }
});

export const updateStatuses = internalMutation(async (ctx) => {
  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "long" });

  // Fetch all seasons
  const seasons = await ctx.db.query("seasons").collect();

  for (const season of seasons) {
    const { startMonth, endMonth, status } = season;

    // --- Transition 1: UPCOMING → ACTIVE ---
    if (status === "upcoming" && startMonth === currentMonth) {
      await ctx.db.patch(season._id, { status: "active" });
      continue;
    }

    // --- Transition 2: ACTIVE → COMPLETED ---
    if (status === "active" && endMonth === currentMonth) {
      await ctx.db.patch(season._id, { status: "completed" });
      continue;
    }

    // --- Transition 3: Cleanup rule ---
    // If it's past the endMonth but still active/upcoming, force completion
    const monthIndex = (m: string) => new Date(Date.parse(m + " 1, 2024")).getMonth();

    if (!endMonth) continue;

    const nowIdx = now.getMonth();
    const endIdx = monthIndex(endMonth);

    if (nowIdx > endIdx && status !== "completed") {
      await ctx.db.patch(season._id, { status: "completed" });
    }
  }
});

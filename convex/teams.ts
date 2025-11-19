import { mutation, query } from "./_generated/server";

export const getTeams = query({
  // handler: async (context) => {
  //   const teams = await context.db.query("teams").collect();

  //   return teams;
  // },
  handler: async (context) => {
    const currentYear = new Date().getFullYear().toString();

    // 1. Get the current year document
    const yearDoc = await context.db
      .query("years")
      .filter((q) => q.eq(q.field("year"), currentYear))
      .first();

    if (!yearDoc) return [];

    // 2. Resolve each teamId to an actual team document
    const teams = [];

    for (const teamId of yearDoc.teamIds) {
      const team = await context.db.get(teamId);
      if (team) teams.push(team);
    }

    return teams; // each has: { _id, name }
  },
});

export const ensureYearExists = mutation({
  args: {},
  handler: async (context) => {
    const currentYear = new Date().getFullYear().toString();

    const existingYear = await context.db
      .query("years")
      .filter((q) => q.eq(q.field("year"), currentYear))
      .first();

    if (!existingYear) {
      const availableTeams = (await context.db.query("teams").collect()).map((team) => team._id);

      await context.db.insert("years", {
        year: currentYear,
        teamIds: [availableTeams[0], availableTeams[1]],
      });

      return { created: true };
    }

    return { created: false };
  },
});

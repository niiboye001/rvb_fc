import { query } from "./_generated/server";

export const getTeams = query({
  handler: async (context) => {
    const teams = await context.db.query("teams").collect();

    return teams;
  },
});

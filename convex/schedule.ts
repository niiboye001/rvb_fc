import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "checkSeasonCreation",
  { hourUTC: 0, minuteUTC: 5 }, // runs daily at 00:05 UTC
  internal.seasonsAuto.createIfNeeded
);

crons.daily(
  "updateSeasonStatuses",
  { hourUTC: 0, minuteUTC: 10 },
  internal.seasonsAuto.updateStatuses
);

export default crons;

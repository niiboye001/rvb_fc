// stores/matchStore.ts
import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

export interface Match {
  _id: Id<"matches">;
  homeTeamName: string;
  awayTeamName: string;
  date?: string;
  homeScore?: number;
  awayScore?: number;
}

interface MatchStore {
  selectedMatch: Match | null;
  setSelectedMatch: (match: Match) => void;
  clearSelectedMatch: () => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  selectedMatch: null,
  setSelectedMatch: (match) => set({ selectedMatch: match }),
  clearSelectedMatch: () => set({ selectedMatch: null }),
}));

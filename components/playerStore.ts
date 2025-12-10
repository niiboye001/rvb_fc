import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

export interface Player {
  playerId: Id<"players">;
  teamId: Id<"teams">;
  playerName: string;
  teamName: string;
}

interface PlayerStore {
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player) => void;
  clearSelectedPlayer: () => void;
}

interface AssistProviderStore {
  selectedAssistProvider: Player | null;
  setSelectedAssistProvider: (player: Player) => void;
  clearSelectedAssistProvider: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  selectedPlayer: null,
  setSelectedPlayer: (match) => set({ selectedPlayer: match }),
  clearSelectedPlayer: () => set({ selectedPlayer: null }),
}));

export const useAssistProviderStore = create<AssistProviderStore>((set) => ({
  selectedAssistProvider: null,
  setSelectedAssistProvider: (match) => set({ selectedAssistProvider: match }),
  clearSelectedAssistProvider: () => set({ selectedAssistProvider: null }),
}));

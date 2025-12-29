import { api } from "@/convex/_generated/api";
import { useFilters } from "@/hooks/useFilter";
import { useQuery } from "convex/react";
import { Text, View } from "react-native";

type PlayerGoal = {
  playerName: string;
  numOfGoals: number;
  team: string | null;
};

type PlayerAssist = {
  playerName: string;
  numOfAssist: number;
  team: string | null;
};

type PlayerRowProps = {
  item: PlayerGoal | PlayerAssist;
  sectionType: "scorer" | "assister";
  //   topData: TopStats;
};

type TopStats = {
  topScorers: (PlayerGoal | null)[];
  assistProviders: (PlayerAssist | null)[];
};

export const PlayerRow = ({ item, sectionType }: PlayerRowProps) => {
  const { filters } = useFilters();

  const topStatsData = useQuery(
    api.seasons.getTopStatsBySeason,
    filters?.seasonId ? { seasonId: filters.seasonId } : "skip"
  );

  // Determine the stat to display
  const stat =
    sectionType === "scorer" && "numOfGoals" in item ? item.numOfGoals
    : sectionType === "assister" && "numOfAssist" in item ? item.numOfAssist
    : 0;

  const topStats: TopStats = topStatsData ?? { topScorers: [], assistProviders: [] };

  const topScorers: (PlayerGoal | null)[] = topStats.topScorers;
  const topAssister: (PlayerAssist | null)[] = topStats.assistProviders;

  // Filter out nulls
  const validScorers = topScorers.filter((s): s is PlayerGoal => s !== null);
  const validAssister = topAssister.filter((s): s is PlayerAssist => s !== null);

  // Find the player with the highest goals
  const highestScorer = validScorers.reduce<PlayerGoal | null>((prev, curr) => {
    if (!prev) return curr;

    return curr.numOfGoals > prev.numOfGoals ? curr : prev;
  }, null);

  // Find the player with the highest assists
  const highestAssistProvider = validAssister.reduce<PlayerAssist | null>((prev, curr) => {
    if (!prev) return curr;

    return curr.numOfAssist > prev.numOfAssist ? curr : prev;
  }, null);

  function getHighlight(item: PlayerGoal | PlayerAssist, sectionType: "scorer" | "assister") {
    if (sectionType === "scorer") return item.playerName === highestScorer?.playerName;

    return item.playerName === highestAssistProvider?.playerName;
  }

  return (
    <View className="flex-row items-center my-2">
      <View className="w-2/5">
        <Text className="text-[16px] text-slate-600">{item.playerName}</Text>
      </View>
      <View className="w-2/5">
        <Text
          className={`${item.team?.trim().toLowerCase() === "red team" && "text-red-500"} ${
            item.team?.trim().toLowerCase() === "blue team" && "text-blue-500"
          } text-[16px]`}>
          {item.team}
        </Text>
      </View>
      <View className="w-1/5 flex items-end">
        <View
          className={`flex items-center justify-center rounded-full h-7 w-7 ${
            getHighlight(item, sectionType) ? "bg-slate-700" : ""
          }`}>
          <Text
            className={`text-[16px] ${getHighlight(item, sectionType) ? "text-slate-100" : "text-slate-500"} font-bold`}>
            {stat}
          </Text>
        </View>
      </View>
    </View>
  );
};

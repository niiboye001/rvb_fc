import LoadingSpinner from "@/components/LoadingSpinner";
import TopStatsCard from "@/components/TopStatsCard";
import { api } from "@/convex/_generated/api";
import { useFilters } from "@/hooks/useFilter";
import { useQuery } from "convex/react";
import { FlatList, ListRenderItem, Text, View } from "react-native";

interface Year {
  id: string;
  year: string;
}

interface Season {
  id: string;
  season: string;
  yearId: string;
}

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

type TopStats = {
  topScorers: (PlayerGoal | null)[];
  assistProviders: (PlayerAssist | null)[];
};

const PlayerStatsScreen = () => {
  const { filters } = useFilters();

  const topStatsData = useQuery(
    api.seasons.getTopStatsBySeason,
    filters?.seasonId ? { seasonId: filters.seasonId } : "skip"
  );

  // console.log(topStatsData);
  if (topStatsData === undefined || !filters?.seasonId) return <LoadingSpinner />;

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

  // console.log(filters);

  const renderTopScorerItem: ListRenderItem<PlayerGoal | null> = ({ item }) => {
    if (!item) return null; // handle potential null values safely

    return (
      <View className="flex-row items-center my-2">
        <View className="w-2/5">
          <Text className="text-[16px] text-slate-600">{item.playerName}</Text>
        </View>
        <View className="w-2/5">
          <Text
            className={`${item.team?.trim().toLocaleLowerCase() === "red team" && "text-red-500"} ${item.team?.trim().toLocaleLowerCase() === "blue team" && "text-blue-500"} text-[16px]`}>
            {item.team}
          </Text>
        </View>
        <View className="w-1/5 flex items-end">
          <View
            className={`flex items-center justify-center rounded-full h-7 w-7 ${item.playerName === highestScorer?.playerName ? "bg-slate-700" : ""}`}>
            <Text
              className={`text-[16px] ${item.playerName === highestScorer?.playerName ? "text-slate-100" : "text-slate-500"}  font-bold`}>
              {item.numOfGoals}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTopAssistItem: ListRenderItem<PlayerAssist | null> = ({ item }) => {
    if (!item) return null; // handle potential null values safely

    return (
      <View className="flex-row items-center my-2">
        <View className="w-2/5">
          <Text className="text-[16px] text-slate-600">{item.playerName}</Text>
        </View>
        <View className="w-2/5">
          <Text
            className={`${item.team?.trim().toLocaleLowerCase() === "red team" && "text-red-500"} ${item.team?.trim().toLocaleLowerCase() === "blue team" && "text-blue-500"} text-[16px]`}>
            {item.team}
          </Text>
        </View>
        <View className="w-1/5 flex items-end">
          <View
            className={`flex items-center justify-center rounded-full h-7 w-7 ${item.playerName === highestAssistProvider?.playerName ? "bg-slate-700" : ""}`}>
            <Text
              className={`text-[16px] ${item.playerName === highestAssistProvider?.playerName ? "text-slate-100" : "text-slate-500"}  font-bold`}>
              {item.numOfAssist}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="px-5 flex-col">
      <Text className="font-extrabold text-[18px] text-slate-700 py-6 uppercase">Top stats</Text>
      <View className="flex-col gap-5">
        <View className="bg-white p-7 rounded-lg flex-col gap-5">
          <TopStatsCard headerName="top scorer" />
          <View className="flex-col gap-5">
            <FlatList
              data={topStats.topScorers.filter(Boolean)}
              renderItem={renderTopScorerItem}
              keyExtractor={(item, index) => item?.playerName ?? index.toString()}
            />
          </View>
        </View>

        <View className="bg-white p-7 rounded-lg flex-col gap-5">
          <TopStatsCard headerName="top assist provider" />
          <View className="flex-col gap-5">
            <FlatList
              data={topStats.assistProviders.filter(Boolean)}
              renderItem={renderTopAssistItem}
              keyExtractor={(item, index) => item?.playerName ?? index.toString()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PlayerStatsScreen;

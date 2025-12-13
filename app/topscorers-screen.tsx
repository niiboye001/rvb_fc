import { useSearchParams } from "expo-router/build/hooks";
import React from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";

type PlayerAssist = {
  playerName: string;
  numOfAssist: number;
  team: string | null;
};

type PlayerGoal = {
  playerName: string;
  numOfGoals: number;
  team: string | null;
};

const TopScorers = () => {
  const searchParams = useSearchParams();
  const senderString = searchParams.get("sender");
  const parsedData = senderString ? JSON.parse(senderString) : [];

  const topScorers: (PlayerGoal | null)[] = parsedData;
  const validScorers = topScorers.filter((s): s is PlayerGoal => s !== null);

  const highestScorer = validScorers.reduce<PlayerGoal | null>((prev, curr) => {
    if (!prev) return curr;

    return curr.numOfGoals > prev.numOfGoals ? curr : prev;
  }, null);

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

  return (
    <View className="p-3">
      <View className="bg-white p-5 rounded-lg">
        <View className="flex-col">
          <View className="flex-row items-center my-2 pb-3 border-b border-slate-100">
            <View className="w-2/5">
              <Text className="text-[16px] text-slate-500 font-extrabold">Player</Text>
            </View>
            <View className="w-2/5">
              <Text className="text-[16px] text-slate-500 font-extrabold">Team</Text>
            </View>
            <View className="w-1/5 flex items-end">
              <Text className="text-[16px] text-slate-500 font-extrabold">Goals</Text>
            </View>
          </View>
          <FlatList
            data={topScorers.filter(Boolean)}
            renderItem={renderTopScorerItem}
            keyExtractor={(item, index) => item?.playerName ?? index.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default TopScorers;

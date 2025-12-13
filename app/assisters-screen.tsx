import { useSearchParams } from "expo-router/build/hooks";
import React from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";

type PlayerAssist = {
  playerName: string;
  numOfAssist: number;
  team: string | null;
};

type TopStats = {
  topScorers: (PlayerGoal | null)[];
  assistProviders: (PlayerAssist | null)[];
};

type PlayerGoal = {
  playerName: string;
  numOfGoals: number;
  team: string | null;
};

const TopAssistProviders = ({ data }: { data: PlayerAssist }) => {
  const searchParams = useSearchParams();
  const senderString = searchParams.get("sender");
  const parsedData = senderString ? JSON.parse(senderString) : [];

  const topAssister: (PlayerAssist | null)[] = parsedData;

  // Filter out nulls
  const validAssister = topAssister.filter((s): s is PlayerAssist => s !== null);
  console.log(parsedData);

  // Find the player with the highest assists
  const highestAssistProvider = validAssister.reduce<PlayerAssist | null>((prev, curr) => {
    if (!prev) return curr;

    return curr.numOfAssist > prev.numOfAssist ? curr : prev;
  }, null);

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
              <Text className="text-[16px] text-slate-500 font-extrabold">Assists</Text>
            </View>
          </View>
          <FlatList
            data={topAssister.filter(Boolean)}
            renderItem={renderTopAssistItem}
            keyExtractor={(item, index) => item?.playerName ?? index.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default TopAssistProviders;

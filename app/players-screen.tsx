import LoadingSpinner from "@/components/LoadingSpinner";
import { useAssistProviderStore, usePlayerStore } from "@/components/playerStore";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

interface TeamWithPlayer {
  playerId: Id<"players">;
  playerName: string;
  teamId: Id<"teams">;
  teamName: string;
}
[];

const PlayersScreen = () => {
  const [search, setSearch] = useState("");

  const setSelectedPlayer = usePlayerStore((s) => s.setSelectedPlayer);
  const setSelectedAssistProvider = useAssistProviderStore((a) => a.setSelectedAssistProvider);
  const { sender, pid, teamId, goalType } = useLocalSearchParams();

  const playersQuery = useQuery(api.players.getTeamPlayers);
  const players = playersQuery;

  // const isLoading = players === undefined;

  if (players === undefined) return <LoadingSpinner title="other" />;

  const cleanedPlayers = (players ?? []).filter((p): p is TeamWithPlayer => p !== null);

  const filtered = useMemo(() => {
    const text = search.toLowerCase();

    // console.log(teamId);

    return cleanedPlayers.filter((p) => {
      if (teamId && !pid && !goalType) return p.teamId === teamId;
      if (teamId && !pid && goalType && goalType === "own_goal") return p.teamId !== teamId;
      if (teamId && !pid && goalType && goalType !== "own_goal") return p.teamId === teamId;
      if (teamId && pid) return p.playerId !== pid && p.teamId === teamId;

      return p?.playerName?.toLowerCase().includes(text);
    });
  }, [cleanedPlayers, pid, search, teamId, goalType]);

  // console.log(filtered);

  const handleSelect = (player: TeamWithPlayer) => {
    sender === "assist" ? setSelectedAssistProvider(player) : setSelectedPlayer(player);
    router.back();
  };

  const renderItem = ({ item, index }: { item: TeamWithPlayer; index: number }) => {
    const isEven = index % 2 === 0;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className={`py-3 px-3 ${isEven ? "bg-slate-100" : "bg-slate-50"}`}>
        <View className="flex-row items-center min-w-full ">
          <View className="w-2/3">
            <Text
              className={`text-slate-500 ${sender === "bookings" ? "text-[16px]" : "text-[19px]"}`}>
              {item.teamName && item.playerName}
            </Text>
          </View>
          {sender === "bookings" && (
            <View className="w-1/3 pl-2">
              <Text
                className={`${item.teamName && item.teamName === "Red Team" && "text-red-500"} ${item.teamName && item.teamName === "Blue Team" && "text-blue-500"} text-[15px] text-left`}>
                {item.teamName}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        className={`bg-white px-4 ${Platform.OS === "ios" && "py-4"} ${Platform.OS === "android" && "-mt-8"} h-screen`}>
        {/* HANDLE */}
        {Platform.OS === "android" ?
          <View className="w-10 flex mx-auto bg-slate-200 h-[5px] rounded-full"></View>
        : ""}

        <View className="py-5">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search player..."
            placeholderTextColor={colors.slate[500]}
            className="border border-blue-200 rounded-lg px-3 py-4 bg-blue-50"
          />
        </View>

        <View className="flex-row items-center py-3">
          <View className=" w-2/3">
            <Text className="text-slate-500 font-semibold uppercase text-[14px]">Player Name</Text>
          </View>
          {sender === "bookings" && (
            <View className=" w-1/3">
              <Text className="text-slate-500 font-semibold uppercase text-[13px]">Team Name</Text>
            </View>
          )}
        </View>

        <View className="flex-1">
          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.playerId}
            nestedScrollEnabled={true}
            ItemSeparatorComponent={null}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlayersScreen;

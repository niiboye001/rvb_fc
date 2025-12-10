import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "./LoadingSpinner";
import { useMatchStore } from "./matchStore";

type MatchDoc = {
  _id: Id<"matches">;
  _creationTime: number;
  homeTeamId: Id<"teams">;
  awayTeamId: Id<"teams">;
  season: Id<"seasons">;
  homeScore?: number;
  awayScore?: number;
  date?: string;
  homeTeamName: string;
  awayTeamName: string;
};

interface Match {
  _id: Id<"matches">;
  homeTeamName: string;
  awayTeamName: string;
  date?: string;
  homeScore?: number;
  awayScore?: number;
}

// interface Props {
//   open: boolean;
//   setOpen: (v: boolean) => void;
//   matches: Match[];
//   onSelect: (match: Match) => void;
// }

const SelectMatch = () => {
  const [search, setSearch] = useState("");
  const setSelectedMatch = useMatchStore((s) => s.setSelectedMatch);

  const matchesQuery = useQuery(api.seasons.getMatchesBySeason);
  const matches = matchesQuery;

  const isLoading = matches === undefined;

  if (isLoading) return <LoadingSpinner title="other" />;

  const filtered = useMemo(() => {
    const text = search.toLowerCase();

    return matches.filter(
      (m) =>
        `${m.homeTeamName} ${m.awayTeamName}`.toLowerCase().includes(text) ||
        m.date?.includes(search)
    );
  }, [matches, search]);

  // const selectedMatch = validMatches.find((m) => m._id === matchId);

  const handleSelect = (match: Match) => {
    setSelectedMatch(match); // save to store
    router.back();
  };

  const renderItem = ({ item, index }: { item: MatchDoc; index: number }) => {
    const isEven = index % 2 === 0;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className={`py-3 px-3 ${isEven ? "bg-slate-50" : "bg-slate-[30]"}`}>
        <View className="flex-row items-center justify-center gap-2 min-w-full">
          <Text className="text-base font-semibold text-slate-800">
            {item.homeTeamName} vs {item.awayTeamName}
          </Text>
          <Text>•</Text>
          <Text className="text-sm text-slate-500">
            {item.date}
            {typeof item.homeScore === "number" &&
              typeof item.awayScore === "number" &&
              `   •   ${item.homeScore} - ${item.awayScore}`}
          </Text>
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
            placeholder="Search match..."
            className="border border-blue-200 rounded-lg px-3 py-4 bg-blue-50"
          />
        </View>

        <View className="flex-1">
          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            nestedScrollEnabled={true}
            ItemSeparatorComponent={null}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectMatch;

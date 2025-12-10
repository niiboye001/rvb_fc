import { Id } from "@/convex/_generated/dataModel";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Match {
  _id: Id<"matches">;
  homeTeamName: string;
  awayTeamName: string;
  date?: string;
  homeScore?: number;
  awayScore?: number;
}

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  matches: Match[];
  onSelect: (match: Match) => void;
}

const MatchPickerBottomSheet = ({ open, setOpen, matches, onSelect }: Props) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [search, setSearch] = useState("");

  const snapPoints = useMemo(() => ["50%", "70%", "90%"], []);
  //   console.log(matches);
  useEffect(() => {
    if (open) sheetRef.current?.expand();
    else sheetRef.current?.close();
  }, [open]);

  const filtered = useMemo(() => {
    const text = search.toLowerCase();
    return matches.filter(
      (m) =>
        `${m.homeTeamName} ${m.awayTeamName}`.toLowerCase().includes(text) ||
        m.date?.includes(search)
    );
  }, [matches, search]);

  const handleSelect = (match: Match) => {
    onSelect(match);
    setOpen(false);
  };

  const renderItem: ListRenderItem<Match> = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className=" py-3 border-b border-slate-200">
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

  return (
    <View className="flex-1">
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={() => setOpen(false)}>
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: 20,
          }}>
          <TextInput
            placeholder="Search match..."
            value={search}
            onChangeText={setSearch}
            className="border border-slate-300 rounded px-4 py-3 mb-3 text-base"
          />

          <FlashList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            nestedScrollEnabled={true}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default MatchPickerBottomSheet;

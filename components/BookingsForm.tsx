import { api } from "@/convex/_generated/api";
import { CardType } from "@/convex/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as colors from "tailwindcss/colors";
import { useMatchStore } from "./matchStore";
import { usePlayerStore } from "./playerStore";

interface ButtonType {
  onCancel: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookingsForm = ({ onCancel }: ButtonType) => {
  const [cardType, setCardType] = useState<CardType | null>(null);
  const [cardOpts, setCardOpts] = useState<{ label: string; value: string }[]>([]);

  const selectedMatch = useMatchStore((s) => s.selectedMatch);
  const clearSelectedMatch = useMatchStore((state) => state.clearSelectedMatch);
  const selectedPlayer = usePlayerStore((p) => p.selectedPlayer);
  const clearSelectedPlayer = usePlayerStore((state) => state.clearSelectedPlayer);

  const addBooking = useMutation(api.bookings.addBooking);

  const isComplete = !!selectedMatch && !!selectedPlayer;
  const shouldDisable = Platform.OS === "ios" && isComplete === false;

  useEffect(() => {
    clearSelectedMatch();
    clearSelectedPlayer();
  }, []);

  const bookings = useQuery(
    api.bookings.getHasCard,
    selectedMatch && selectedPlayer ?
      {
        matchId: selectedMatch?._id!,
        playerId: selectedPlayer?.playerId!,
      }
    : "skip"
  );

  const hasYellow: boolean = bookings?.some((b) => b.cardType === "yellow") ?? false;

  //     ];
  const cardOptions =
    hasYellow ?
      [
        { label: "Second Yellow", value: "second_yellow" },
        { label: "Red Card", value: "red" },
      ]
    : [
        { label: "Yellow", value: "yellow" },
        { label: "Red", value: "red" },
      ];

  // setCardOpts(cardOptions);

  const handleCancel = () => {
    clearSelectedMatch();
    clearSelectedPlayer();
    onCancel(false);
  };

  const handleSave = () => {
    if (!selectedMatch?._id || !selectedPlayer?.playerId || !selectedPlayer?.teamId || !cardType) {
      return;
    }

    addBooking({
      matchId: selectedMatch._id,
      playerId: selectedPlayer.playerId,
      teamId: selectedPlayer.teamId,
      cardType: cardType,
    });

    clearSelectedMatch();
    clearSelectedPlayer();
    onCancel(false);
  };

  return (
    <View className="flex-col items-center justify-center gap-7">
      {/* PLAYER SELECTION SECTION */}
      <View className="min-w-full">
        <Link
          href={{ pathname: "/players-screen", params: { sender: "bookings" } }}
          className="border border-slate-300 p-4 rounded-lg">
          <Text className="text-[16px]">Tap to select player</Text>
        </Link>

        {selectedPlayer && (
          <View className="bg-slate-100 border border-slate-200 px-3 py-4 flex-row items-center justify-center gap-10 mt-1 rounded-lg">
            {/* <Text>{`${selectedMatch.homeTeamName} vs ${selectedMatch.awayTeamName}`}</Text> */}
            <Text className="text-base font-semibold text-slate-800">
              {selectedPlayer.playerName}
            </Text>
            <Text>&mdash;</Text>
            <Text className="text-sm text-slate-500">{selectedPlayer.teamName}</Text>
          </View>
        )}
      </View>

      {/* MATCH SELECTION SECTION */}
      <View className="min-w-full">
        <Link href={"/matches-screen"} className="border border-slate-300 p-4 rounded-lg">
          Tap to select match
        </Link>

        {selectedMatch && (
          <View className="bg-slate-100 border border-slate-200 px-3 py-4 flex-row items-center justify-center gap-2 mt-1 rounded-lg">
            {/* <Text>{`${selectedMatch.homeTeamName} vs ${selectedMatch.awayTeamName}`}</Text> */}
            <Text className="text-base font-semibold text-slate-800">
              {selectedMatch.homeTeamName} vs {selectedMatch.awayTeamName}
            </Text>
            <Text>•</Text>
            <Text className="text-sm text-slate-500">
              {selectedMatch.date}
              {typeof selectedMatch.homeScore === "number" &&
                typeof selectedMatch.awayScore === "number" &&
                `   •   ${selectedMatch.homeScore} - ${selectedMatch.awayScore}`}
            </Text>
          </View>
        )}
      </View>

      {/* CAD TYPE SELECTION SECTION */}
      <View className="min-w-full border border-slate-300 rounded-lg">
        <Dropdown
          disable={shouldDisable}
          placeholder="Select card type"
          data={cardOptions}
          labelField="label"
          valueField="value"
          value={cardType}
          onChange={(item) => setCardType(item.value)}
          style={{ padding: 12, opacity: shouldDisable ? 0.3 : 1 }}
        />
      </View>

      {/* ACTION BUTTONS */}
      {/* Submit */}
      <View className="flex-row items-center justify-center gap-2 pt-6">
        <LinearGradient
          colors={[colors.green[500], colors.green[600]]}
          style={{ borderRadius: 5, flex: 1 }}>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 py-5"
            activeOpacity={0.8}
            onPress={handleSave}>
            <Text className="text-white font-semibold ml-2 text-[17px]">Save</Text>
            <Ionicons name="checkmark" size={12} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={[colors.red[500], colors.red[600]]}
          style={{ borderRadius: 5, flex: 1 }}>
          <TouchableOpacity
            className="flex-row items-center justify-center py-5"
            activeOpacity={0.8}
            onPress={handleCancel}>
            <Ionicons name="close" size={12} color="#fff" />
            <Text className="text-white font-semibold ml-2 text-[17px]">Cancel</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default BookingsForm;

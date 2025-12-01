import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SwipeableItem from "react-native-swipeable-item";
import colors from "tailwindcss/colors";
import BookingCard from "./BookingCard";

interface ItemType {
  bookingId: Id<"bookings">;
  playerId: Id<"players">;
  playerName: string;
  teamName: string | null;
  cards: string[];
}

interface SwipeType {
  item: ItemType;
  stripe: boolean;
  onDelete: () => void;
}

const SwipeableRow = ({ item, stripe, onDelete }: SwipeType) => {
  const hasSecondYellow = item.cards.includes("second_yellow");
  const hasRed = item.cards.includes("red");

  let displayCard = "yellow";

  if (hasSecondYellow) displayCard = "second_yellow";
  if (hasRed) displayCard = "red";

  const dressName = (tname: string) => {
    const cleanName = tname.toLowerCase().replace(" team", "");

    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  const renderUnderlay = () => (
    <View className="flex-1 bg-red-500 justify-center pr-4">
      <View className="flex-row justify-end">
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SwipeableItem
      key={item.bookingId}
      item={item}
      overSwipe={20}
      renderUnderlayLeft={renderUnderlay}
      snapPointsLeft={[80]}>
      <View className={`flex-row items-center py-3 pl-1 ${!stripe ? "bg-white" : "bg-[#fcfdfe]"}`}>
        <View className="w-[40%]">
          <Text className="text-slate-600 text-[14px]">{item.playerName}</Text>
        </View>
        <View className="w-[40%]">
          <Text
            className={`${item.teamName?.trim().toLocaleLowerCase() === "red team" && "text-red-600"} ${item.teamName?.trim().toLocaleLowerCase() === "blue team" && "text-blue-600"} text-[14px]`}>
            {dressName(item.teamName ?? "")}
          </Text>
        </View>
        <View className="w-[20%]">
          <BookingCard ctype={displayCard} />
        </View>
      </View>
    </SwipeableItem>
  );
};

export default SwipeableRow;

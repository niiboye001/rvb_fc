import React from "react";
import { View } from "react-native";

const BookingCard = ({ ctype = "" }) => {
  return (
    <View>
      {ctype === "yellow" && <View className="w-4 h-6 bg-yellow-400 rounded-[3]"></View>}
      {ctype === "red" && <View className="w-4 h-6 bg-red-500 rounded-[3]"></View>}
      {ctype === "second_yellow" && (
        <View className="flex-row">
          <View className="w-4 h-6 bg-yellow-400 rounded"></View>
          <View className="w-4 h-6 bg-red-500 rounded -ml-3 -mt-1"></View>
        </View>
      )}
    </View>
  );
};

export default BookingCard;

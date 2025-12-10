import React from "react";
import { Text, View } from "react-native";

const PlayerNameRow = ({ playerName = "", counter = 0 }) => {
  return (
    <View className="py-1 flex-row items-center">
      <Text className="pr-2">{counter}.</Text>
      <Text className="text-[15px] text-slate-500">{playerName}</Text>
    </View>
  );
};

export default PlayerNameRow;

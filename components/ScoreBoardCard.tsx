import React from "react";
import { Text, View } from "react-native";

const ScoreBoardCard = ({ score = "", sender = "" }) => {
  return (
    <View
      className={`w-20 h-20 ${sender === "red" ? "bg-red-600" : "bg-blue-600"} flex items-center justify-center rounded-lg`}>
      <Text className="text-white font-extrabold text-5xl">{score}</Text>
    </View>
  );
};

export default ScoreBoardCard;

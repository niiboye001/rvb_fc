import SeasonCard from "@/components/SeasonCard";
import React from "react";
import { Text, View } from "react-native";

const SeasonsScreen = () => {
  // const handleCollapsedState = () => {};

  return (
    <View className="px-5 flex-col">
      <Text className="font-extrabold text-[15px] text-slate-700 py-4 uppercase">
        {} calendar year
      </Text>
      <View className="flex-col gap-3">
        <View className="bg-white rounded-lg">
          <SeasonCard cardTitle="first season" />
        </View>
      </View>
    </View>
  );
};

export default SeasonsScreen;

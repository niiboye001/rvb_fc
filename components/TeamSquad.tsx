import React from "react";
import { Text, View } from "react-native";
import BackgroundCard from "./BackgroundCard";

const TeamSquad = () => {
  return (
    <BackgroundCard title="team squad">
      <View className="flex-row justify-between pt-5">
        <View className="">
          <Text className="pr-1 uppercase text[15px] text-slate-500 font-semibold">Blue Team</Text>
        </View>
        <View className="">
          <Text className="pr-1 uppercase text[15px] text-slate-500 font-semibold">Red Team</Text>
        </View>
      </View>
    </BackgroundCard>
  );
};

export default TeamSquad;

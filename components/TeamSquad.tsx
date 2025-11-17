import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, View } from "react-native";
import * as colors from "tailwindcss/colors";
import BackgroundCard from "./BackgroundCard";

const TeamSquad = () => {
  const teams = [];

  if (teams.length === 0)
    return (
      <View className="bg-white p-5 flex-col items-center justify-center gap-3 h-72 rounded-lg mt-3">
        <Ionicons name="warning" size={35} color={colors.slate[300]} />
        <Text className="text-center text-[18px] px-5 text-slate-400">
          Players are yet to be put into the available teams!
        </Text>
      </View>
    );

  return (
    <BackgroundCard gap={true} title="team squad">
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

import React from "react";
import { Text, View } from "react-native";

const SquadList = () => {
  return (
    <View className="flex-row justify-between pt-5">
      <View>
        <Text className="font-semibold italic text[11px] text-slate-400 ">Blue Team</Text>
      </View>
      <View>
        <Text className="font-semibold italic text[11px] text-slate-400">Red Team</Text>
      </View>
    </View>
  );
};

export default SquadList;

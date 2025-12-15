import Ionicons from "@react-native-vector-icons/ionicons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as colors from "tailwindcss/colors";

const SeasonCard = ({ cardTitle = "" }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <TouchableOpacity activeOpacity={0.6} onPress={() => setIsCollapsed(!isCollapsed)}>
        <View
          className={`flex-row items-center justify-between p-5 bg-slate-700 rounded-t-lg ${isCollapsed && "rounded-b-lg"}`}>
          <Text className="uppercase font-bold text-[13px] text-slate-300">{cardTitle}</Text>
          {isCollapsed ?
            <Ionicons name="chevron-forward-sharp" size={15} color={colors.slate[400]} />
          : <Ionicons name="chevron-down-sharp" size={15} color={colors.slate[400]} />}
        </View>
      </TouchableOpacity>
      {!isCollapsed && (
        <View className="bg-white p-5">
          <Text>lasjdf</Text>
        </View>
      )}
    </>
  );
};

export default SeasonCard;

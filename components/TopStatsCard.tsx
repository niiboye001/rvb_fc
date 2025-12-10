import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import * as colors from "tailwindcss/colors";
import Subtitles from "./Subtitles";

const TopStatsCard = ({ headerName = "" }) => {
  return (
    <TouchableOpacity activeOpacity={0.6}>
      <View className="flex-row items-center justify-between">
        <Subtitles subtitle={headerName} />
        <Ionicons name="chevron-forward-sharp" size={14} color={colors.slate[400]} />
      </View>
    </TouchableOpacity>
  );
};

export default TopStatsCard;

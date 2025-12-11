import React from "react";
import { Text } from "react-native";

const Subtitles = ({ subtitle = "" }) => {
  return <Text className="text-[14px] text-slate-500 font-bold uppercase">{subtitle}</Text>;
};

export default Subtitles;

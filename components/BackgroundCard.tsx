import React, { ReactNode } from "react";
import { View } from "react-native";
import Subtitles from "./Subtitles";

const BackgroundCard = ({
  title = "",
  gap = false,
  children,
}: {
  title: string;
  gap: boolean;
  children: ReactNode;
}) => {
  return (
    <View className={`px-7 py-5 bg-white my-2 rounded-lg flex flex-col ${gap ? "gap-2" : ""}`}>
      <Subtitles subtitle={title} />
      {children}
    </View>
  );
};

export default BackgroundCard;

import BackgroundCard from "@/components/BackgroundCard";
import React from "react";
import { Text } from "react-native";

const SeasonsScreen = () => {
  return (
    <BackgroundCard title={"seasons"} gap={false}>
      <Text>Seasons</Text>
    </BackgroundCard>
  );
};

export default SeasonsScreen;

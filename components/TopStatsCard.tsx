import Ionicons from "@react-native-vector-icons/ionicons";
import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
import * as colors from "tailwindcss/colors";
import Subtitles from "./Subtitles";

type PlayerAssist = {
  playerName: string;
  numOfAssist: number;
  team: string | null;
};

type TopStats = {
  topScorers: (PlayerGoal | null)[];
  assistProviders: (PlayerAssist | null)[];
};

type PlayerGoal = {
  playerName: string;
  numOfGoals: number;
  team: string | null;
};

const TopStatsCard = ({ headerName = "", data }: { headerName: string; data: TopStats }) => {
  return (
    <Link
      href={{
        pathname:
          headerName.trim().toLocaleLowerCase().includes("scorers") ?
            "/topscorers-screen"
          : "/assisters-screen",
        params: {
          sender: JSON.stringify(
            headerName.trim().toLocaleLowerCase().includes("scorers") ?
              data.topScorers
            : data.assistProviders
          ),
        },
      }}
      className="py-2">
      <View className="flex-row items-center justify-between w-full bg-white">
        <Subtitles subtitle={headerName} />
        <Ionicons name="chevron-forward-sharp" size={14} color={colors.slate[400]} />
      </View>
    </Link>
  );
};

export default TopStatsCard;

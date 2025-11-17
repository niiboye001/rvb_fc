import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import { Text, View } from "react-native";

type PlayerType = Doc<"players"> & { team: Doc<"teams"> };

interface DetailsType {
  num: number;
  player: PlayerType;
}

const RowCard = ({ player, num }: DetailsType) => {
  const teamName = player.team?.name.slice(0, player.team?.name.lastIndexOf(" "));

  return (
    <View className="flex flex-row items-center justify-between border-b border-slate-100 py-2">
      <View className="flex-row items-center w-[10%]">
        <Text className="text-[15px] text-slate-500">{num}.</Text>
      </View>
      <View className="flex-row items-center w-[35%]">
        <Text className="text-[15px] text-slate-500">{player.name}</Text>
      </View>
      <View className="flex-row items-center w-[25%]">
        <Text
          className={`text-[15px] ${teamName === "Blue" && "text-blue-500"} ${teamName === "Red" && "text-red-500"} text-slate-500`}>
          {player.team?.name ? teamName : "-"}
          {/* {teams && teams[0]?.label.slice(0, teams[0]?.label.lastIndexOf(" "))} */}
        </Text>
      </View>
      <View className="flex-row items-center w-[30%]">
        <Text className="text-[15px] text-slate-500">
          {player.phone === "" ? "—" : player.phone}
        </Text>
      </View>

      {/* <Text className="text-[15px] text-slate-500">{name}</Text>
        <Text className="text-[15px] text-slate-500">-</Text>
        <Text className="text-[15px] text-slate-500">{phoneNum === "" ? "—" : phoneNum}</Text> */}
    </View>
  );
};

export default RowCard;

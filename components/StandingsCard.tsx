import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, View } from "react-native";
import colors from "tailwindcss/colors";

interface StandingsType {
  draws: number;
  goalDifference: number;
  goalsFor: number;
  goalsAgainst: number;
  losses: number;
  played: number;
  points: number;
  position: number;
  team: string;
  wins: number;
}

// interface Props {
//   standings: StandingsType;
// }

const StandingsCard = ({ standings }: { standings: StandingsType[] }) => {
  //   console.log(standings.length);

  return (
    <>
      <View className="flex-col">
        <View className="my-3">
          <Text className="font-extrabold uppercase text-slate-500 text-[13px]">League table</Text>
        </View>
        <View className="flex-row border-b border-slate-100 pb-2 mt-3">
          <View className="w-[5%]">
            <Text></Text>
          </View>
          <View className="w-[15%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold pl-1">Team</Text>
          </View>
          <View className="w-[10%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold">P</Text>
          </View>
          <View className="w-[10%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold">W</Text>
          </View>
          <View className="w-[10%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold">D</Text>
          </View>
          <View className="w-[10%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold">L</Text>
          </View>
          <View className="w-[10%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold">G+</Text>
          </View>
          <View className="w-[10%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold">G-</Text>
          </View>
          <View className="w-[10%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold">GD</Text>
          </View>
          <View className="w-[10%]">
            <Text className="text-slate-500 text-[13px] uppercase font-semibold">pts</Text>
          </View>
        </View>

        <View className="flex-col py-2 gap-2">
          {standings &&
            standings.filter(Boolean).map((item) => (
              <View
                key={item.team}
                className={`flex flex-row py-1 border-b border-slate-100 ${item.position === 1 ? "bg-slate-100" : ""}`}>
                <View className="w-[5%] flex items-center justify-center">
                  {item.position === 1 && (
                    <Ionicons name="trophy" size={10} color={colors.orange[400]} />
                  )}
                </View>
                <View className="w-[15%]">
                  <Text
                    className={`${item.team?.toLocaleLowerCase() === "blue team" ? "text-blue-500" : "text-red-500"} text-[13px] uppercase font-bold`}>
                    {item.team?.slice(0, item.team.lastIndexOf(" "))}
                  </Text>
                </View>
                <View className="w-[10%]">
                  <Text className="text-slate-500 text-[14px] uppercase">{item.played}</Text>
                </View>
                <View className="w-[10%]">
                  <Text className="text-slate-500 text-[14px] uppercase">{item.wins}</Text>
                </View>
                <View className="w-[10%]">
                  <Text className="text-slate-500 text-[14px] uppercase">{item.draws}</Text>
                </View>
                <View className="w-[10%]">
                  <Text className="text-slate-500 text-[14px] uppercase">{item.losses}</Text>
                </View>
                <View className="w-[10%]">
                  <Text className="text-slate-500 text-[14px] uppercase">{item.goalsFor}</Text>
                </View>
                <View className="w-[10%]">
                  <Text className="text-slate-500 text-[14px] uppercase">{item.goalsAgainst}</Text>
                </View>
                <View className="w-[10%]">
                  <Text className="text-slate-500 text-[14px] uppercase">
                    {item.goalDifference}
                  </Text>
                </View>
                <View className="w-[10%]">
                  <Text className="text-slate-500 text-[14px] uppercase">{item.points}</Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    </>
  );
};

export default StandingsCard;

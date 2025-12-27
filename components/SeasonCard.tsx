import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as colors from "tailwindcss/colors";
import StandingsCard from "./StandingsCard";

interface DataType {
  season: string;
  standings: any[];
  topScorer: Winner<"goals"> | null;
  topAssister: Winner<"assists"> | null;
}

type Winner<T extends "goals" | "assists"> =
  | ({ player: string; team: string } & Record<T, number>)
  | ({ player: string; team: string } & Record<T, number>)[];

interface SeasonOverviewType {
  seasonOverview: DataType[];
  cardTitle: string;
}

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

type SeasonTopStats = {
  topScorer: Winner<"goals"> | null;
  topAssister: Winner<"assists"> | null;
};

// interface Props {
//   standings: StandingsType[];
// }

const SeasonCard = ({ cardTitle = "", seasonOverview }: SeasonOverviewType) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const standings: StandingsType[] = seasonOverview[0]?.standings ?? [];
  const topScorer: Winner<"goals"> | null = seasonOverview[0]?.topScorer ?? null;
  const topAssister: Winner<"assists"> | null = seasonOverview[0]?.topAssister ?? null;

  const scorers =
    topScorer ?
      Array.isArray(topScorer) ?
        topScorer
      : [topScorer]
    : [];

  const assisters =
    topAssister ?
      Array.isArray(topAssister) ?
        topAssister
      : [topAssister]
    : [];

  // standings.forEach((item) => console.log(item.goalDifference));
  // console.log(topScorer);
  // console.log(topAssister);

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
          <StandingsCard standings={standings} />

          {topScorer && topAssister ?
            <View className="flex-col gap-8 mt-10">
              <View>
                <View className="flex-row items-center gap-2 pb-2">
                  <Text className="uppercase font-extrabold text-slate-500 text-[13px]">
                    Top scorer
                  </Text>
                  {/* <Ionicons name="medal" size={13} color={colors.orange[600]} /> */}
                </View>
                {scorers.map((s) => (
                  <View className="flex-row items-center justify-between my-2">
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="text-[17px] text-slate-500">{s?.player}</Text>
                      <LinearGradient
                        colors={[colors.orange[500], colors.orange[700]]}
                        style={{ borderRadius: 50 }}>
                        <View className="w-5 h-5 rounded-full flex items-center justify-center">
                          <Text className="text-white font-extrabold">{s?.goals}</Text>
                        </View>
                      </LinearGradient>
                    </View>
                    <View>
                      <Text
                        className={`text-[17px] ${s?.team.trim().toLocaleLowerCase() === "red team" && "text-red-500"} ${s?.team.trim().toLocaleLowerCase() === "blue team" && "text-blue-500"}`}>
                        {s?.team}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View>
                <View className="flex-row items-center gap-2 pb-2">
                  <Text className="uppercase font-extrabold text-slate-500 text-[13px]">
                    Top Assist provider
                  </Text>
                  {/* <Ionicons name="medal" size={13} color={colors.orange[500]} /> */}
                </View>
                {assisters.map((t) => (
                  <View className="flex-row items-center justify-between my-2">
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="text-[17px] text-slate-500">{t?.player}</Text>
                      <LinearGradient
                        colors={[colors.orange[500], colors.orange[700]]}
                        style={{ borderRadius: 50 }}>
                        <View className="w-5 h-5 rounded-full flex items-center justify-center">
                          <Text className="text-white font-extrabold">{t?.assists}</Text>
                        </View>
                      </LinearGradient>
                    </View>
                    <View>
                      <Text
                        className={`text-[17px] ${t?.team.trim().toLocaleLowerCase() === "red team" && "text-red-500"} ${t?.team.trim().toLocaleLowerCase() === "blue team" && "text-blue-500"}`}>
                        {t?.team}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          : <View className="flex-row items-center justify-center px-8 py-16 bg-slate-50 rounded-lg my-4">
              <Text className="text-[18px] text-center text-slate-400 font-light">
                No record found for <Text className="font-bold">scorers</Text> and/or{" "}
                <Text className="font-bold">assist providers</Text> yet.
              </Text>
            </View>
          }
        </View>
      )}
    </>
  );
};

export default SeasonCard;

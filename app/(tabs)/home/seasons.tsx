import SeasonCard from "@/components/SeasonCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { Text, View } from "react-native";

const SeasonsScreen = () => {
  const yearId = useQuery(api.seasons.getYearByName, { year: "2025" });

  const rawOverview = useQuery(
    api.seasons.getYearOverview,
    yearId ? { yearId: yearId._id } : "skip"
  ) ?? { standings: [], topScorer: null, topAssister: null };

  if (!rawOverview) return;

  const seasonsArray = Object.entries(rawOverview).map(([season, data]) => ({
    season,
    standings: data?.standings,
    topScorer: data?.topScorer,
    topAssister: data?.topAssister,
  }));

  // console.log(seasonsArray[0]);

  return (
    <View className="px-5 flex-col">
      <Text className="font-extrabold text-[15px] text-slate-700 py-4 uppercase">
        {new Date().getFullYear()} calendar year
      </Text>
      <View className="flex-col gap-3">
        <View className="bg-white rounded-lg">
          <SeasonCard cardTitle={seasonsArray[0].season} seasonOverview={seasonsArray} />)
        </View>
      </View>
    </View>
  );
};

export default SeasonsScreen;

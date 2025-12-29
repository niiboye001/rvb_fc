import SeasonCard from "@/components/SeasonCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SeasonsScreen = () => {
  // const [year, setYear] = useState<string>();
  const { chosenYear } = useLocalSearchParams();
  const yearId = useQuery(
    api.seasons.getYearByName,
    chosenYear ? { year: chosenYear as string } : "skip"
  );

  // useEffect(() => {
  //   if (chosenYear) setYear(chosenYear as string);
  // }, []);
  // const yearId = useQuery(api.seasons.getYearByName, { year: chosenYear });
  // console.log(chosenYear);

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
        {chosenYear && chosenYear} calendar year
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

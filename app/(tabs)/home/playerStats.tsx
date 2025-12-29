import LoadingSpinner from "@/components/LoadingSpinner";
import { PlayerRow } from "@/components/PlayerRow";
import TopStatsCard from "@/components/TopStatsCard";
import { api } from "@/convex/_generated/api";
import { useFilters } from "@/hooks/useFilter";
import { useQuery } from "convex/react";
import { SectionList, SectionListRenderItem, Text, View } from "react-native";

// interface Year {
//   id: string;
//   year: string;
// }

// interface Season {
//   id: string;
//   season: string;
//   yearId: string;
// }

type PlayerGoal = {
  playerName: string;
  numOfGoals: number;
  team: string | null;
};

type PlayerAssist = {
  playerName: string;
  numOfAssist: number;
  team: string | null;
};

type SectionType = {
  type: "scorer" | "assister";
  title: string;
  data: (PlayerGoal | PlayerAssist)[];
};

// type PlayerRowProps = {
//   item: PlayerGoal | PlayerAssist;
//   sectionType: "scorer" | "assister";
// };

type TopStats = {
  topScorers: (PlayerGoal | null)[];
  assistProviders: (PlayerAssist | null)[];
};

const PlayerStatsScreen = () => {
  const { filters } = useFilters();

  const topStatsData = useQuery(
    api.seasons.getTopStatsBySeason,
    filters?.seasonId ? { seasonId: filters.seasonId } : "skip"
  );

  // console.log(topStatsData);
  if (topStatsData === undefined || !filters?.seasonId) return <LoadingSpinner />;

  const topStats: TopStats = topStatsData ?? { topScorers: [], assistProviders: [] };

  // const topScorers: (PlayerGoal | null)[] = topStats.topScorers;
  // const topAssister: (PlayerAssist | null)[] = topStats.assistProviders;

  const goalData: PlayerGoal[] = topStats.topScorers.filter(
    (item): item is PlayerGoal => item !== null
  );

  const assistData: PlayerAssist[] = topStats.assistProviders.filter(
    (item): item is PlayerAssist => item !== null
  );

  const sections: SectionType[] = [
    { type: "scorer", title: "Top Scorers", data: goalData },
    {
      type: "assister",
      title: "Top Assist Providers",
      data: assistData,
    },
  ] as const;

  const renderTopStatsItem: SectionListRenderItem<PlayerGoal | PlayerAssist, SectionType> = ({
    item,
    section,
  }) => {
    if (!item) return null;

    if (section.type === "scorer") {
      return <PlayerRow item={item as PlayerGoal} sectionType="scorer" />;
    }

    return <PlayerRow item={item as PlayerAssist} sectionType={section.type} />;
  };

  return (
    <View className="px-5 flex-col flex-1">
      <Text className="font-extrabold text-[16px] text-slate-700 py-4 uppercase">Top stats</Text>
      <View className="flex-col gap-5">
        <View className="bg-white p-7 rounded-lg flex-col gap-5">
          <SectionList
            sections={sections}
            stickySectionHeadersEnabled={false}
            keyExtractor={(item, index) => (item ? item.playerName : `${index}`)}
            renderSectionHeader={({ section }) => (
              <TopStatsCard headerName={section.title} data={topStats} />
            )}
            renderItem={renderTopStatsItem}
            renderSectionFooter={() => <View className="my-6 border-b border-slate-100"></View>}
          />
        </View>
      </View>
    </View>
  );
};

export default PlayerStatsScreen;

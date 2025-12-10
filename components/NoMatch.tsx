import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { View } from "react-native";
import NoData from "./NoData";

type TeamType = { label: string; value: Id<"teams"> };

const NoMatch = () => {
  // const [showForm, setShowForm] = useState(false);

  // const addMatch = useMutation(api.seasons.addMatchDetails);

  // const teams: TeamType[] =
  //   useQuery(api.teams.getTeams)?.map((team) => ({
  //     label: team.name,
  //     value: team._id,
  //   })) ?? [];

  return (
    <>
      {/* {!showForm ? */}
      <View className="flex flex-col items-center justify-center gap-2 pt-[150px]">
        <NoData />
        {/* <TouchableOpacity activeOpacity={0.8} onPress={() => setShowForm(true)}>
            <View className="flex flex-row items-center justify-center gap-3 bg-slate-200 rounded-l-full rounded-r-full p-2">
              <LinearGradient
                colors={[colors.slate[300], colors.slate[400]]}
                style={{ borderRadius: 50, padding: 10 }}>
                <Ionicons name="add" size={20} color={colors.slate[500]} />
              </LinearGradient>
              <Text className="text-slate-400 font-semibold pr-1 text-[15px]">
                Add today's match details.
              </Text>
            </View>
          </TouchableOpacity> */}
      </View>
      {/* : <BackgroundCard title="" gap={false}>
          <MatchForm teams={teams} onSubmit={addMatch} setShowForm={setShowForm} />
        </BackgroundCard>
      } */}
    </>
  );
};

export default NoMatch;

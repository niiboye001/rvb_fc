import BackgroundCard from "@/components/BackgroundCard";
import BookingsForm from "@/components/BookingsForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { MatchForm } from "@/components/MatchForm";
import NoMatch from "@/components/NoMatch";
import ScoreBoardCard from "@/components/ScoreBoardCard";
import Subtitles from "@/components/Subtitles";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as colors from "tailwindcss/colors";

type TeamType = { label: string; value: Id<"teams"> };

const CurrentResultScreen = () => {
  const [showScorelineForm, setShowScorelineForm] = useState(false);
  const [showBookingsForm, setShowBookingsForm] = useState(false);
  const [showGCForm, setShowGCForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const currMatch = useQuery(api.seasons.getCurrentMatchResult);
  const addMatch = useMutation(api.seasons.addMatchDetails);

  const teams: TeamType[] =
    useQuery(api.teams.getTeams)?.map((team) => ({
      label: team.name,
      value: team._id,
    })) ?? [];

  // useEffect(() => {
  //   // !currMatch ? setShowNoData(true) : setShowNoData(false);
  //   if (!currMatch) {
  //     setShowNoData(true);
  //   } else {
  //     setShowNoData(false);
  //   }
  // }, []);

  const handleScoreline = () => {
    setIsVisible(true);
    setShowScorelineForm(true);
    setShowBookingsForm(false);
    setShowGCForm(false);
    // setShowNoData(false);
  };

  const handleBookings = () => {
    setIsVisible(true);
    setShowBookingsForm(true);
    setShowScorelineForm(false);
    setShowGCForm(false);
  };

  const isLoading = currMatch === undefined;

  if (isLoading) return <LoadingSpinner title="other" />;

  // const data = null;
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 10 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={15}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row gap-3 py-1">
          <LinearGradient
            colors={[colors.slate[500], colors.slate[600]]}
            style={{ borderRadius: 5, paddingTop: 13, paddingBottom: 13, flex: 1 }}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleScoreline}>
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="add" size={12} color={colors.slate[100]} />
                <Text className="text-slate-100 uppercase text-[13px] font-bold">scoreline</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={[colors.slate[500], colors.slate[600]]}
            style={{ borderRadius: 5, paddingTop: 13, paddingBottom: 13, flex: 1 }}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleBookings}>
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="add" size={12} color={colors.slate[100]} />
                <Text className="text-slate-100 uppercase text-[13px] font-bold">bookings</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={[colors.slate[500], colors.slate[600]]}
            style={{ borderRadius: 5, paddingTop: 13, paddingBottom: 13, flex: 1 }}>
            <TouchableOpacity activeOpacity={0.7}>
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="add" size={12} color={colors.slate[100]} />
                <Text className="text-slate-100 uppercase text-[13px] font-bold">gc</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {isVisible ?
          <>
            {showScorelineForm && (
              <BackgroundCard title="scoreline form" gap={true}>
                <MatchForm
                  teams={teams}
                  onSubmit={addMatch}
                  setIsVisible={setIsVisible}
                  setShowScorelineForm={setShowScorelineForm}
                />
              </BackgroundCard>
            )}

            {showBookingsForm && (
              // <BackgroundCard title="Bookings form" gap={true}>
              <View className="bg-white px-5 pt-6 pb-32 mt-2 rounded-lg flex-col gap-10">
                <Subtitles subtitle="bookings form" />
                <BookingsForm />
              </View>
              // </BackgroundCard>
            )}
          </>
        : <>
            {!currMatch && <NoMatch />}

            {currMatch && (
              <>
                {/* SCORELINE */}
                <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-7">
                  <Subtitles subtitle="Scoreline" />
                  <View className="flex flex-row gap-5 items-center justify-between">
                    <ScoreBoardCard score={currMatch?.homeScore?.toString()} sender="blue" />
                    <View className="w-10 h-1 bg-slate-600 flex items-center justify-center rounded-lg"></View>
                    <ScoreBoardCard score={currMatch?.awayScore?.toString()} sender="red" />
                  </View>
                </View>

                {/* SCORERES AND ASSIST PROVIDERS */}
                <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-7">
                  <Subtitles subtitle="Scorers and Assist Providers" />
                  <View className="flex flex-row gap-5 items-center justify-between">
                    <View className="">
                      <Text className="italic font-semibold text-slate-600">Scorers</Text>
                    </View>
                    <View>
                      <Text className="italic font-semibold text-slate-600">Assist Providers</Text>
                    </View>
                  </View>
                </View>

                {/* BOOKINGS */}
                <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-7">
                  <Subtitles subtitle="Bookings" />
                </View>
              </>
            )}
          </>
        }

        {/* {showForm && } */}
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default CurrentResultScreen;

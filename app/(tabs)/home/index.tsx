import BackgroundCard from "@/components/BackgroundCard";
import BookingCard from "@/components/BookingCard";
import BookingsForm from "@/components/BookingsForm";
import GoalContributionsForm from "@/components/GoalContributionsForm";
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
// import util from "util";

type TeamType = { label: string; value: Id<"teams"> };
type PlayerBookingGroup = {
  bookingId: Id<"bookings">;
  playerId: Id<"players">;
  playerName: string;
  teamName: string | null;
  cards: string[];
};

const CurrentResultScreen = () => {
  const [showScorelineForm, setShowScorelineForm] = useState(false);
  const [showBookingsForm, setShowBookingsForm] = useState(false);
  const [showGCForm, setShowGCForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const currMatch = useQuery(api.seasons.getCurrentMatchResult);
  const addMatch = useMutation(api.seasons.addMatchDetails);
  const playerWithBooking = useQuery(api.players.getCurrentMatchBookings);

  // console.log(JSON.stringify(playerWithBooking, null, 2));

  const teams: TeamType[] =
    useQuery(api.teams.getTeams)?.map((team) => ({
      label: team.name,
      value: team._id,
    })) ?? [];

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

  const handleGoalContribution = () => {
    setIsVisible(true);
    setShowGCForm(true);
    setShowBookingsForm(false);
    setShowScorelineForm(false);
  };

  // const handleDelete = (bid: Id<"bookings">) => {
  //   console.log("Deleted: " + bid);
  // };

  const isLoading = currMatch === undefined;

  if (isLoading) return <LoadingSpinner title="other" />;

  if (!playerWithBooking) return null;

  const grouped: Record<string, PlayerBookingGroup> = {};

  for (const b of playerWithBooking) {
    const key = b.playerId as string;

    grouped[key] ??= {
      bookingId: b.bookingId,
      playerId: b.playerId,
      playerName: b.playerName,
      teamName: b.teamName,
      cards: [],
    };

    grouped[key].cards.push(b.cardType);
  }

  const finalPlayers = Object.values(grouped);
  // console.log(JSON.stringify(finalPlayers, null, 2));

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
            <TouchableOpacity activeOpacity={0.7} onPress={handleGoalContribution}>
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
              <View className="bg-white px-5 pt-6 pb-10 mt-2 rounded-lg flex-col gap-10">
                <Subtitles subtitle="bookings form" />
                <BookingsForm onCancel={setIsVisible} />
              </View>
              // </BackgroundCard>
            )}

            {showGCForm && (
              // <BackgroundCard title="Bookings form" gap={true}>
              <View className="bg-white px-5 pt-6 pb-10 mt-2 rounded-lg flex-col gap-5">
                <Subtitles subtitle="goal contributions" />
                <GoalContributionsForm onCancel={setIsVisible} />
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
                <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col">
                  <Subtitles subtitle="Bookings" />
                  <View className="flex-row mt-5 py-2 pl-1 border-b border-slate-100">
                    <View className="w-[40%]">
                      <Text className="text-slate-400 uppercase text-[12px] font-semibold">
                        Player
                      </Text>
                    </View>
                    <View className="w-[40%]">
                      <Text className="text-slate-400 uppercase text-[12px] font-semibold">
                        Team
                      </Text>
                    </View>
                    <View className="w-[20%]">
                      <Text className="text-slate-400 uppercase text-[12px] font-semibold">
                        Card
                      </Text>
                    </View>
                  </View>

                  {finalPlayers.map((p, i) => {
                    const stripe = i % 2 === 0;

                    const hasSecondYellow = p.cards.includes("second_yellow");
                    const hasRed = p.cards.includes("red");

                    let displayCard = "yellow";

                    if (hasSecondYellow) displayCard = "second_yellow";
                    if (hasRed) displayCard = "red";

                    const dressName = (tname: string) => {
                      const cleanName = tname.toLowerCase().replace(" team", "");

                      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                    };

                    return (
                      <View
                        key={p.bookingId}
                        className={`flex-row items-center py-3 pl-1 ${stripe ? "bg-white" : "bg-slate-50"}`}>
                        <View className="w-[40%]">
                          <Text className="text-slate-600 text-[14px]">{p.playerName}</Text>
                        </View>
                        <View className="w-[40%]">
                          <Text
                            className={`${p.teamName?.trim().toLocaleLowerCase() === "red team" && "text-red-600"} ${p.teamName?.trim().toLocaleLowerCase() === "blue team" && "text-blue-600"} text-[14px]`}>
                            {dressName(p.teamName ?? "")}
                          </Text>
                        </View>
                        <View className="w-[20%]">
                          <BookingCard ctype={displayCard} />
                        </View>
                        {/* <View className="flex items-center justify-center">
                          <LinearGradient
                            colors={[colors.red[400], colors.red[600]]}
                            style={{ borderRadius: 20, padding: 10 }}>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => handleDelete(p.bookingId)}>
                              <Ionicons name="close" size={10} color={colors.white} />
                            </TouchableOpacity>
                          </LinearGradient>
                        </View> */}
                      </View>
                    );
                  })}

                  {/* {playerWithBooking &&
                    playerWithBooking.map(
                      (b) =>
                        b.cardType.includes("second_yellow") && (
                          <View className="flex-row">
                            <View className="w-[40%]">
                              <Text className="text-slate-500 text-[14px]">{b.playerName}</Text>
                            </View>
                            <View className="w-[40%]">
                              <Text className="text-slate-500 text-[14px]">{b.teamName}</Text>
                            </View>
                            <View className="w-[20%]">
                              <Text className="text-slate-500 text-[14px]">
                                <BookingCard ctype={b.cardType} />
                              </Text>
                            </View>
                          </View>
                        )
                    )} */}
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

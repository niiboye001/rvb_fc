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
import { useEffect, useState } from "react";
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

export interface MatchDetailType {
  date: string | undefined;
  homeTeam: {
    tname: string;
    score: number;
    gc: {
      scorer: string | null;
      assister: string | null;
      gtype: string | null;
    }[];
    bookings: {
      book: string | null;
      ctype: "yellow" | "red" | "second_yellow";
    }[];
  };
  awayTeam: {
    tname: string;
    score: number;
    gc: {
      scorer: string | null;
      assister: string | null;
      gtype: string | null;
    }[];
    bookings: {
      book: string | null;
      ctype: "yellow" | "red" | "second_yellow";
    }[];
  };
}

type CardType = "yellow" | "red" | "second_yellow";

interface Goal {
  scorer: string | null;
  assister: string | null;
  gtype: string | null; // e.g. "normal" | "penalty" | "own_goal" | null
}

// interface TeamDetails {
//   tname: string;
//   score: number;
//   gc: Goal[];
//   bookings: { book: string | null; ctype: CardType }[];
// }

// interface MatchDetails {
//   date: string | undefined;
//   homeTeam: TeamDetails;
//   awayTeam: TeamDetails;
// }

interface GroupedGoalOutput {
  scorer: string;
  assister: string | null;
  count: number;
  gtype?: string; // penalty, own_goal, normal goal
}

const CurrentResultScreen = () => {
  const [showScorelineForm, setShowScorelineForm] = useState(false);
  const [showBookingsForm, setShowBookingsForm] = useState(false);
  const [showGCForm, setShowGCForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<MatchDetailType | undefined>(undefined);
  const [loadingMatch, setLoadingMatch] = useState(false);

  // const currMatch = useQuery(api.seasons.getCurrentMatchResult);
  const currMatchDetails = useQuery(api.seasons.getCurrentMatchDetails);
  const addMatch = useMutation(api.seasons.addMatchDetails);
  const playerWithBooking = useQuery(api.players.getCurrentMatchBookings);

  useEffect(() => {
    if (currMatchDetails) {
      setCurrentMatch(currMatchDetails);
      setLoadingMatch(false);
    }
  }, [currMatchDetails]);

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

  function groupGoalsForDisplay(goals: Goal[]): GroupedGoalOutput[] {
    // { scorer -> { assister -> { count, gtype } } }
    const map = new Map<string, Map<string | null, { count: number; gtype?: string }>>();

    for (const g of goals) {
      const scorer = g.scorer!;
      const assister = g.assister ?? null;

      if (!map.has(scorer)) {
        map.set(scorer, new Map());
      }

      const assisterMap = map.get(scorer)!;

      if (!assisterMap.has(assister)) {
        assisterMap.set(assister, { count: 0, gtype: g.gtype! });
      }

      const entry = assisterMap.get(assister)!;
      entry.count += 1;

      // if any goal in this group is a penalty or own goal, keep that info
      if (g.gtype) {
        entry.gtype = g.gtype;
      }
    }

    const output: GroupedGoalOutput[] = [];

    for (const [scorer, assisterMap] of map.entries()) {
      for (const [assister, data] of assisterMap.entries()) {
        output.push({
          scorer,
          assister,
          count: data.count,
          gtype: data.gtype,
        });
      }
    }

    return output;
  }

  if (currentMatch === undefined || loadingMatch) {
    return <LoadingSpinner title="other" />;
  }

  const dedupedHome = groupGoalsForDisplay(currentMatch.homeTeam.gc);
  const dedupedAway = groupGoalsForDisplay(currentMatch.awayTeam.gc);

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
                  onSaved={setCurrentMatch}
                  onLoading={setLoadingMatch}
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
            {!currentMatch && <NoMatch />}

            {currentMatch && (
              <>
                {/* SCORELINE */}
                <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-7">
                  <Subtitles subtitle="Scoreline" />
                  <View className="flex flex-row gap-5 items-center justify-between">
                    <ScoreBoardCard
                      score={currentMatch?.homeTeam.score?.toString()}
                      sender="blue"
                    />

                    <View className="flex-col items-center justify-center">
                      <View className="w-10 h-1 bg-slate-300 mt-10 flex items-center justify-center "></View>
                      <Text className="mt-3 text-lg text-slate-600 font-light">
                        {currentMatch.date}
                      </Text>
                    </View>

                    <ScoreBoardCard score={currentMatch?.awayTeam.score?.toString()} sender="red" />
                  </View>
                </View>

                {/* SCORERES AND ASSIST PROVIDERS */}
                <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-7">
                  <Subtitles subtitle="Scorers and Assist Providers" />
                  <View className="flex flex-row">
                    <View className="w-[50%] flex-col gap-3">
                      <View>
                        <Text
                          className={`${/\bred\b/i.test(currentMatch.homeTeam?.tname.toString() ?? "") && "text-red-500"} ${/\bblue\b/i.test(currentMatch.homeTeam?.tname ?? "") && "text-blue-500"} uppercase text-[12px] font-bold`}>
                          {currentMatch.homeTeam?.tname.toString()}
                        </Text>
                      </View>
                      <View className="flex flex-col">
                        {dedupedHome.map((g, i) => (
                          <View key={i} className="flex-row items-center gap-3 py-2">
                            {/* <View>
                              <Ionicons
                                name="football"
                                size={17}
                                color={
                                  g.gtype && g.gtype === "own_goal" ?
                                    colors.red[400]
                                  : colors.slate[500]
                                }
                              />
                            </View> */}
                            <View>
                              {g.gtype === "penalty" && (
                                <Ionicons name="football" size={17} color={colors.slate[500]} />
                              )}
                              {g.gtype === "own_goal" && (
                                <Ionicons name="football" size={17} color={colors.red[500]} />
                              )}
                              {g.gtype === "normal" && (
                                <Ionicons name="football" size={17} color={colors.slate[500]} />
                              )}
                            </View>

                            <View className="flex-col gap-1">
                              <Text className="text-[15px] text-slate-600 font-semibold">
                                {g.scorer}{" "}
                                {g.count > 1 && (
                                  <Text className="opacity-70">({`x${g.count}`})</Text>
                                )}
                              </Text>
                              {g.assister && (
                                <Text className="text-slate-500">Assisted by {g.assister}</Text>
                              )}
                              {g.gtype && g.gtype === "own_goal" && (
                                <Text className="text-slate-500 text-sm">Own goal</Text>
                              )}
                              {g.gtype && g.gtype === "penalty" && (
                                <Text className="text-slate-500 text-sm">Penalty</Text>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View className="w-[50%] flex-col gap-3">
                      <View>
                        <Text
                          className={`${/\bred\b/i.test(currentMatch.awayTeam?.tname ?? "") && "text-red-500"} ${/\bblue\b/i.test(currentMatch.awayTeam?.tname ?? "") && "text-blue-500"} uppercase text-[12px] font-bold`}>
                          {currentMatch.awayTeam.tname.toString()}
                        </Text>
                      </View>
                      <View className="flex flex-col">
                        {dedupedAway.map((g, i) => (
                          <View key={i} className="flex-row items-center gap-3 py-2">
                            {/* <View>
                              <Ionicons
                                name="football"
                                size={17}
                                color={
                                  g.gtype && g.gtype === "own_goal" ?
                                    colors.red[400]
                                  : colors.slate[500]
                                }
                              />
                            </View> */}
                            <View>
                              {g.gtype === "penalty" && <Ionicons name="football" size={17} />}
                              {g.gtype === "own_goal" && (
                                <Ionicons name="football" size={17} color={colors.red[500]} />
                              )}
                              {g.gtype === "normal" && (
                                <Ionicons name="football" size={17} color={colors.slate[500]} />
                              )}
                            </View>

                            <View className="flex-col gap-1">
                              <Text className="text-[15px] text-slate-600 font-semibold">
                                {g.scorer}{" "}
                                {g.count > 1 && (
                                  <Text className="opacity-70">({`x${g.count}`})</Text>
                                )}
                              </Text>
                              {g.assister && (
                                <Text className="text-slate-500 text-sm">
                                  Assisted by {g.assister}
                                </Text>
                              )}
                              {g.gtype && g.gtype === "own_goal" && (
                                <Text className="text-slate-500 text-sm">Own goal</Text>
                              )}
                              {g.gtype && g.gtype === "penalty" && (
                                <Text className="text-slate-500 text-sm">Penalty</Text>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                    {/* {teams.map((t) => (
                      <View key={t.value} className="w-[50%]">
                        <Text
                          className={`${t.label.toLocaleLowerCase().includes("red") && "text-red-500"} ${t.label.toLocaleLowerCase().includes("blue") && "text-blue-500"} uppercase text-[12px] font-bold`}>
                          {t.label.toString()}
                        </Text>
                      </View>
                    ))} */}
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

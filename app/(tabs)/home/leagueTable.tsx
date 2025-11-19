import NewPlayerForm from "@/components/NewPlayerForm";
import PlayersScreen from "@/components/PlayersScreen";
import Subtitles from "@/components/Subtitles";
import TeamSquad from "@/components/TeamSquad";
import { api } from "@/convex/_generated/api";
import useApp from "@/hooks/useAppContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as colors from "tailwindcss/colors";

const LeagueTableScreen = () => {
  const { handleVisibility, showNewPlayerForm, showPlayers, showTeamSquad, showUpdateForm } =
    useApp();
  // const [isShowPlayerForm, setIsShowPlayerForm] = useState<boolean | undefined>(false);
  // const { isShowing, toggleVisibility } = useApp();
  // const [showNewPlayerForm, setShowNewPlayerForm] = useState(false);
  // const [showPlayers, setShowPlayers] = useState(true);
  // const [showTeamSquad, setShowTeamSquad] = useState(false);

  // const handleVisibility = (s: string) => {
  //   if (s === "np") {
  //     setShowNewPlayerForm(true);
  //     setShowPlayers(false);
  //     setShowTeamSquad(false);
  //   } else if (s === "p") {
  //     setShowPlayers(true);
  //     setShowNewPlayerForm(false);
  //     setShowTeamSquad(false);
  //   } else {
  //     setShowTeamSquad(true);
  //     setShowPlayers(false);
  //     setShowNewPlayerForm(false);
  //   }
  // };

  // GET ALL THE TEAMS
  const teams =
    useQuery(api.teams.getTeams)?.map((team) => ({ label: team.name, value: team._id })) ?? [];

  return (
    <Pressable>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={15}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-2">
            <Subtitles subtitle="Table" />

            {/* TABLE HEAD */}
            <View className="flex-row border-b border-slate-100 pb-2 mt-3">
              <View className="w-[20%]">
                <Text className="text-slate-500 text-[15px] uppercase font-semibold">Team</Text>
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

            {/* TABLE DATA - FIRST ROW */}
            <View className="flex-row border-b border-slate-100 pb-2">
              <View className="w-[20%]">
                <Text className="text-slate-600 text-[14px] uppercase font-light">
                  {teams && teams[0]?.label.slice(0, teams[0]?.label.lastIndexOf(" "))}
                </Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-600 text-[13px] font-extrabold">0</Text>
              </View>
            </View>

            {/* TABLE DATA - SECOND ROW */}
            <View className="flex-row border-b border-slate-100 pb-2">
              <View className="w-[20%]">
                <Text className="text-slate-600 text-[14px] uppercase font-light">
                  {teams && teams[1]?.label.slice(0, teams[1]?.label.lastIndexOf(" "))}
                </Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-600 text-[14px] font-extrabold">0</Text>
              </View>
            </View>
          </View>

          <View className="mt-5 flex flex-row items-center justify-between">
            <View className="flex-row items-center justify-center gap-2">
              <TouchableOpacity activeOpacity={0.7} onPress={() => handleVisibility("p")}>
                <View
                  className={`border ${showPlayers ? "border-blue-300 bg-blue-100" : "border-blue-300"} px-5 py-2 rounded-full`}>
                  <Text className="uppercase text-[12px] text-slate-500">players</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={() => handleVisibility("ts")}>
                <View
                  className={`border ${showTeamSquad ? "border-blue-300 bg-blue-100" : "border-blue-300"} px-5 py-2 rounded-full`}>
                  <Text className="uppercase text-[12px] text-slate-500">team squad</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.9} onPress={() => handleVisibility("np")}>
              <View className="flex flex-row items-center justify-end">
                <LinearGradient
                  colors={[colors.blue[400], colors.blue[600]]}
                  style={{
                    borderRadius: 25,
                    paddingRight: 7,
                    paddingLeft: 7,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}>
                  <View className="flex-row items-center justify-center gap-1">
                    <Ionicons name="add" size={20} color={colors.white} />
                    <Text className="text-white pr-1 text-[12px] uppercase">Add player</Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>

          {showPlayers && <PlayersScreen />}
          {showTeamSquad && <TeamSquad />}
          {/* {showUpdateForm && <PlayerUpdateForm />} */}
          {showNewPlayerForm && <NewPlayerForm handleVisibility={handleVisibility} />}
        </ScrollView>
      </KeyboardAwareScrollView>
    </Pressable>
  );
};

export default LeagueTableScreen;

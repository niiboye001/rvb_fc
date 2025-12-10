import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as colors from "tailwindcss/colors";
import { useMatchStore } from "./matchStore";
import { useAssistProviderStore, usePlayerStore } from "./playerStore";

interface ButtonType {
  onCancel: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TeamOptionsType {
  label: string;
  value: Id<"teams">;
}

interface GoalOptionsType {
  label: string;
  value: "normal" | "own_goal" | "penalty";
}

const GoalContributionsForm = ({ onCancel }: ButtonType) => {
  const [team, setTeam] = useState<Id<"teams"> | null>(null);
  const [assisted, setAssisted] = useState<boolean | null>(null);
  const [goalType, setGoalType] = useState<string>();

  const playerRef = useRef<Id<"players">>(null);

  const selectedMatch = useMatchStore((s) => s.selectedMatch);
  const clearSelectedMatch = useMatchStore((state) => state.clearSelectedMatch);

  const selectedPlayer = usePlayerStore((p) => p.selectedPlayer);
  const clearSelectedPlayer = usePlayerStore((state) => state.clearSelectedPlayer);
  const selectedAssistProvider = useAssistProviderStore((p) => p.selectedAssistProvider);
  const clearSelectedAssistProvider = useAssistProviderStore((s) => s.clearSelectedAssistProvider);

  const teams = useQuery(api.teams.getTeams);
  const goalEvent = useMutation(api.seasons.addGoalEvent);

  const isComplete = !!selectedMatch && !!team;
  const shouldDisable = isComplete === false;
  const radios = !!selectedMatch && !!team && !!selectedPlayer;

  //   console.log("...: " + radios);
  useEffect(() => {
    if (playerRef.current !== selectedPlayer?.playerId) {
      clearSelectedAssistProvider();
      playerRef.current = selectedPlayer?.playerId ?? null;
    }
  }, [selectedPlayer?.playerId]);

  useEffect(() => {
    clearSelectedMatch();
    clearSelectedPlayer();
    clearSelectedAssistProvider();
  }, []);

  if (!teams) return;

  const handleCondition = (value: string) => {
    value === "y" && setAssisted(true);
    value === "n" && setAssisted(false);

    clearSelectedAssistProvider();
  };

  const teamOptions = teams.map((t) => ({
    label: t.name.toString(),
    value: t._id,
  }));

  const goalTypeOptions = [
    { label: "Normal", value: "normal" },
    { label: "Own goal", value: "own_goal" },
    { label: "Penalty", value: "penalty" },
  ];

  const handleCancel = () => {
    onCancel(false);
  };

  const handleSave = async () => {
    const goalEventData = {
      matchId: selectedMatch?._id!,
      teamId: team!,
      scorerId: selectedPlayer?.playerId!,
      goalType: goalType as "normal" | "own_goal" | "penalty",
      assisterId: selectedAssistProvider?.playerId || undefined,
    };

    await goalEvent(goalEventData);

    onCancel(false);

    // console.log(goalEventData);
  };

  const handleTeamChange = (item: TeamOptionsType) => {
    setTeam(item.value);
    setAssisted(false);

    clearSelectedPlayer();
    clearSelectedAssistProvider();

    // console.log(team);
  };

  const handleGoalTypeChange = (item: GoalOptionsType) => {
    setGoalType(item.value);

    setAssisted(false);
    clearSelectedPlayer();
    clearSelectedAssistProvider();
  };

  return (
    <View className="flex-col items-center justify-center gap-7 mt-3">
      {/* SELECT MATCH */}
      <View className="min-w-full">
        <Link href={"/matches-screen"} className="border border-slate-300 p-4 rounded-lg">
          <Text className="text-[16px]">Tap to select match</Text>
        </Link>

        {selectedMatch && (
          <View className="bg-slate-100 border border-slate-200 px-3 py-4 flex-row items-center justify-center gap-2 mt-1 rounded-lg">
            {/* <Text>{`${selectedMatch.homeTeamName} vs ${selectedMatch.awayTeamName}`}</Text> */}
            <Text className="text-base font-semibold text-slate-800">
              {selectedMatch.homeTeamName} vs {selectedMatch.awayTeamName}
            </Text>
            <Text>•</Text>
            <Text className="text-sm text-slate-500">
              {selectedMatch.date}
              {typeof selectedMatch.homeScore === "number" &&
                typeof selectedMatch.awayScore === "number" &&
                `   •   ${selectedMatch.homeScore} - ${selectedMatch.awayScore}`}
            </Text>
          </View>
        )}
      </View>

      {/* SELECT TEAM */}
      <View className="min-w-full border border-slate-300 rounded-lg">
        <Dropdown
          placeholder="Select team"
          data={teamOptions}
          labelField="label"
          valueField="value"
          value={team}
          onChange={handleTeamChange}
          style={{ padding: 12 }}
        />
      </View>

      {/* Select the type of goal scored: normal, own goal, penalty */}
      <View className="min-w-full border border-slate-300 rounded-lg">
        <Dropdown
          placeholder="Select goal type"
          data={goalTypeOptions}
          labelField="label"
          valueField="value"
          value={goalType}
          onChange={handleGoalTypeChange}
          style={{ padding: 12 }}
        />
      </View>

      {/* PLAYER SELECTION SECTION */}
      {goalType && (
        <View className="min-w-full">
          <Link
            href={{ pathname: "/players-screen", params: { teamId: team, goalType: goalType } }}
            asChild>
            <Pressable
              disabled={shouldDisable}
              className={`border border-slate-300 p-4 rounded-lg ${shouldDisable ? "opacity-40" : "opacity-100"}`}>
              <Text className="text-[16px]">Tap to select scorer</Text>
            </Pressable>
          </Link>

          {selectedPlayer && (
            <View className="bg-slate-100 border border-slate-200 px-3 py-4 flex-row items-center  gap-10 mt-1 rounded-lg">
              {/* <Text>{`${selectedMatch.homeTeamName} vs ${selectedMatch.awayTeamName}`}</Text> */}
              <Text className="uppercase text-slate-500">Selected Player:</Text>
              <Text className="text-[18px] text-base font-semibold text-slate-800 uppercase overflow-auto pr-2">
                {selectedPlayer.playerName}
              </Text>
              {/* <Text className="text-sm text-slate-500">{selectedPlayer.teamName}</Text> */}
            </View>
          )}
        </View>
      )}

      {/* WAS THE GOAL ASSISTED */}
      {goalType && goalType !== "own_goal" && goalType !== "penalty" && (
        <>
          <View
            className={`flex-row items-center gap-4 border border-slate-300 min-w-full pl-3 py-4 rounded-lg ${radios === false ? "opacity-30" : ""}`}>
            <Text className="text-[16px] font-semibold">Was the goal assisted?</Text>

            <View className={`flex-row items-center gap-5 `}>
              {/* YES */}
              <TouchableOpacity
                disabled={!radios}
                className={`flex flex-row items-center gap-2`}
                onPress={() => handleCondition("y")}>
                <View
                  className={`w-7 h-7 rounded-full border ${
                    assisted === true ? "bg-sky-400 border-sky-400" : "border-gray-400"
                  }`}
                />
                <Text className="text-[15px]">Yes</Text>
              </TouchableOpacity>

              {/* NO */}
              <TouchableOpacity
                disabled={!radios}
                className="flex flex-row items-center gap-2"
                onPress={() => handleCondition("n")}>
                <View
                  className={`w-7 h-7 rounded-full border ${
                    assisted === false ? "bg-sky-400 border-sky-400" : "border-gray-400"
                  }`}
                />
                <Text className="text-[15px]">No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {assisted && (
            <>
              {/* Select assist provider */}
              <View className="min-w-full">
                <Link
                  href={{
                    pathname: "/players-screen",
                    params: { sender: "assist", pid: selectedPlayer?.playerId, teamId: team },
                  }}
                  className="border border-slate-300 p-4 rounded-lg">
                  <Text className="text-[16px]">Tap to select assist provider</Text>
                </Link>

                {selectedAssistProvider && (
                  <View className="bg-slate-100 border border-slate-200 px-3 py-4 flex-row items-center  gap-10 mt-1 rounded-lg">
                    {/* <Text>{`${selectedMatch.homeTeamName} vs ${selectedMatch.awayTeamName}`}</Text> */}
                    <Text className="uppercase text-slate-500">Selected Player:</Text>
                    <Text className="text-[18px] text-base font-semibold text-slate-800 uppercase overflow-auto pr-2">
                      {selectedAssistProvider.playerName}
                    </Text>
                    {/* <Text className="text-sm text-slate-500">{selectedAssistProvider.teamName}</Text> */}
                  </View>
                )}
              </View>
            </>
          )}
        </>
      )}

      <View className="flex-row items-center justify-center gap-2">
        <LinearGradient
          colors={[colors.green[500], colors.green[600]]}
          style={{ borderRadius: 5, flex: 1 }}>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 py-5"
            activeOpacity={0.8}
            onPress={handleSave}>
            <Text className="text-white font-semibold ml-2 text-[17px]">Save</Text>
            <Ionicons name="checkmark" size={12} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={[colors.red[500], colors.red[600]]}
          style={{ borderRadius: 5, flex: 1 }}>
          <TouchableOpacity
            className="flex-row items-center justify-center py-5"
            activeOpacity={0.8}
            onPress={handleCancel}>
            <Ionicons name="close" size={12} color="#fff" />
            <Text className="text-white font-semibold ml-2 text-[17px]">Cancel</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default GoalContributionsForm;

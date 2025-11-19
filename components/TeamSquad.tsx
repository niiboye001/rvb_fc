import { api } from "@/convex/_generated/api";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useQuery } from "convex/react";
import React from "react";
import { Text, View } from "react-native";
import * as colors from "tailwindcss/colors";
import BackgroundCard from "./BackgroundCard";
import LoadingSpinner from "./LoadingSpinner";
import PlayerNameRow from "./PlayerNameRow";

const TeamSquad = () => {
  const teamSquad = useQuery(api.players.getTeamsWithPlayers);

  const isData = teamSquad?.[0].players.length === 0 && teamSquad?.[1].players.length === 0;
  const isLoading = teamSquad === undefined;

  if (isLoading) return <LoadingSpinner />;

  if (isData) {
    return (
      <View className="bg-white p-5 flex-col items-center justify-center gap-3 h-72 rounded-lg mt-3">
        <Ionicons name="warning" size={35} color={colors.slate[300]} />
        <Text className="text-center text-[18px] px-5 text-slate-400">
          Players are yet to be put into the available teams!
        </Text>
      </View>
    );
  }

  return (
    <BackgroundCard gap={true} title="team squad">
      <View className="flex-row justify-between gap-10 pt-5">
        <View className="flex-col w-[50%]">
          <Text className="pr-1 uppercase text-[12px] text-blue-600 mb-3">
            {teamSquad?.[0].team?.name}
          </Text>
          {teamSquad?.[0].players.map((player, index) => (
            <PlayerNameRow key={player?._id} counter={index + 1} playerName={player?.name} />
          ))}
        </View>
        <View className="flex-col w-[50%]">
          <Text className="pr-1 uppercase text-[12px] text-red-600 mb-3">
            {teamSquad?.[1].team?.name}
          </Text>
          {teamSquad?.[1].players.map((player, index) => (
            <PlayerNameRow key={player?._id} counter={index + 1} playerName={player?.name} />
          ))}
        </View>
      </View>
    </BackgroundCard>
  );
};

export default TeamSquad;

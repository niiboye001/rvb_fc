import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useApp from "@/hooks/useAppContext";
import { useQuery } from "convex/react";
import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BackgroundCard from "./BackgroundCard";
import LoadingSpinner from "./LoadingSpinner";
import PlayerUpdateForm from "./PlayerUpdateForm";
import RowCard from "./RowCard";

type PlayerType = Doc<"players">;
type PlayerWithTeamType = Doc<"players"> & { team: Doc<"teams"> };

const PlayersScreen = () => {
  const { showUpdateForm } = useApp();

  const [recordId, setRecordId] = useState<Id<"players"> | undefined>(undefined);

  const playerIdRef = useRef<Id<"players"> | null>(null);
  const playerRef = useRef<PlayerType | null>(null);

  const allPlayers = useQuery(api.players.getPlayers) as PlayerWithTeamType[] | undefined;
  const isLoading = allPlayers === undefined;

  const handleRow = (player: PlayerType) => {
    setRecordId(player._id);
    playerIdRef.current = player._id;
    playerRef.current = player;

    // Alert.alert("Info", `${recordId} // ${playerRef.current}`);
  };

  const isEditing = recordId === playerIdRef.current;

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {isEditing ?
        <PlayerUpdateForm player={playerRef.current} setRecordId={setRecordId} />
      : <BackgroundCard title="all players" gap={false}>
          <View className="flex flex-row items-center justify-between mb-4 mt-7">
            <View className="flex-row items-center w-[10%]">
              <Text className="uppercase text-[12px] text-slate-400">#</Text>
            </View>
            <View className="flex-row items-center w-[35%]">
              <Text className="uppercase text-[12px] text-slate-400">name</Text>
            </View>
            <View className="flex-row items-center w-[25%]">
              <Text className="uppercase text-[12px] text-slate-400">team</Text>
            </View>
            <View className="flex-row items-center w-[30%]">
              <Text className="uppercase text-[12px] text-slate-400">phone number</Text>
            </View>
          </View>
          {allPlayers &&
            allPlayers?.map((player, index) => (
              <TouchableOpacity key={player._id} onPress={() => handleRow(player)}>
                <RowCard num={index + 1} player={player} />
              </TouchableOpacity>
            ))}
        </BackgroundCard>
      }
    </>
  );
};

export default PlayersScreen;

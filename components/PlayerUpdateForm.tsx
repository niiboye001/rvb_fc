import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useApp from "@/hooks/useAppContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { TextInput } from "react-native-gesture-handler";
import * as colors from "tailwindcss/colors";
import BackgroundCard from "./BackgroundCard";

interface PlayerType {
  player: Doc<"players"> | null;
  setRecordId: React.Dispatch<React.SetStateAction<Id<"players"> | undefined>>;
}

type VisibleType = { handleVisibility: (s: string) => void };
type TeamType = { label: string; value: Id<"teams"> };

const PlayerUpdateForm = ({ player, setRecordId }: PlayerType) => {
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState<Id<"teams"> | null>(null);
  const [playerName, setPlayerName] = useState(player?.name);
  const [playerPhone, setPlayerPhone] = useState(player?.phone);
  const [playerId, setPlayerId] = useState(player?._id);

  const { handleVisibility } = useApp();

  const updatePlayer = useMutation(api.players.updatePlayer);
  const addPlayerToTeam = useMutation(api.players.AssignPlayerToTeam);

  //   useEffect(() => {
  //     setPlayerDetails(player);
  //   });
  const teams: TeamType[] =
    useQuery(api.teams.getTeams)?.map((team) => ({
      label: team.name,
      value: team._id,
    })) ?? [];

  const handleCancel = () => {
    setRecordId(undefined);
    handleVisibility?.("p");
  };

  const handleUpdate = async () => {
    if (!playerId) {
      Alert.alert("Error", "No player ID provided.");

      return;
    }

    const updated = await updatePlayer({
      id: playerId ?? "",
      name: playerName ?? "",
      phone: playerPhone ?? "",
    });

    if (updated) {
      if (!playerId || !team) return;

      const result = await addPlayerToTeam({ playerId: playerId, teamId: team });

      if (result && result === "existing") {
        Alert.alert("Info", "Player already belongs to this team.");
        return;
      }

      Alert.alert("Success", "Player updated successfully!");
    }
  };

  return (
    <BackgroundCard title="update form" gap={false}>
      <View className="pt-7 pb-3 flex flex-col gap-5">
        <TextInput
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Player's Name..."
          className="border border-slate-300 p-3 rounded-lg text-[17px] text-slate-600"
        />
        <TextInput
          value={playerPhone}
          onChangeText={setPlayerPhone}
          placeholder="Phone Number..."
          className="border border-slate-300 p-3 rounded-lg text-[17px] text-slate-600"
        />
        <View>
          <DropDownPicker
            flatListProps={{ scrollEnabled: false }}
            open={open}
            value={team}
            items={teams}
            setOpen={setOpen}
            setValue={setTeam}
            // setItems={setItems}
            // onChangeValue={handleChange}
            placeholder="Select team"
            style={{ borderColor: "#ccc" }}
            labelStyle={{ fontSize: 15, color: colors.slate[500] }}
            dropDownContainerStyle={{ borderColor: "#ccc" }}
          />
        </View>
      </View>

      <View className="flex-row items-center justify-end gap-2">
        <TouchableOpacity activeOpacity={0.6} onPress={handleUpdate}>
          <LinearGradient
            colors={[colors.green[500], colors.green[700]]}
            style={{ borderRadius: 5, padding: 4 }}>
            <View className="flex-row items-center justify-center gap-2 px-5 py-2">
              <Text className="text-white text-[15px]">Save</Text>
              <Ionicons name="checkmark" color={colors.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.6} onPress={handleCancel}>
          <LinearGradient
            colors={[colors.red[500], colors.red[700]]}
            style={{ borderRadius: 5, padding: 4 }}>
            <View className="flex-row items-center justify-center gap-2 px-5 py-2">
              <Ionicons name="close" color={colors.white} size={13} />
              <Text className="text-white text-[15px]">Cancel</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </BackgroundCard>
  );
};

export default PlayerUpdateForm;

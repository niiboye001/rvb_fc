import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { Alert, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as colors from "tailwindcss/colors";
import Buttons from "./Buttons";
import Subtitles from "./Subtitles";

// TYPES
type VisibleType = { handleVisibility: (s: string) => void };
type TeamType = { label: string; value: string };

const NewPlayerForm = ({ handleVisibility }: VisibleType) => {
  const [newPlayer, setNewPlayer] = useState<string | undefined>("");
  const [phone, setPhone] = useState<string | undefined>("");

  // GET THE AVAILABLE TEAMS
  const teams: TeamType[] =
    useQuery(api.teams.getTeams)?.map((team) => ({
      label: team.name,
      value: team._id,
    })) ?? [];

  // FOR THE DROP DOWN PICKER
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState<string | null>(null);

  // const prevValue = useRef<string | null>(null);

  // const handleChange = () => {
  //   if (prevValue.current !== team && team) Alert.alert("Info", "Selected team ID: " + team);
  //   prevValue.current = team;
  // };

  // ADD NEW PLAYER
  const addPlayer = useMutation(api.players.addPlayer);

  const handleAddPlayer = async () => {
    try {
      if (newPlayer?.trim() && phone?.trim()) {
        await addPlayer({ name: newPlayer, phone: phone });
      } else if (newPlayer?.trim()) {
        await addPlayer({ name: newPlayer, phone: null });
        // Alert.alert("Error", "Skipped");
        // return;
      } else {
        return;
      }
    } catch (error) {
      Alert.alert("Error", "Failed to insert data: " + error);
    }
  };

  return (
    <View className="px-7 py-5 bg-white my-2 rounded-lg flex flex-col gap-2">
      <Subtitles subtitle="New player form" />
      <View className="pt-7 pb-3 flex flex-col gap-5">
        <TextInput
          value={newPlayer}
          onChangeText={setNewPlayer}
          placeholder="Player's Name..."
          className="border border-slate-300 p-3 rounded-lg text-[17px] text-slate-600"
        />
        <TextInput
          value={phone}
          onChangeText={setPhone}
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
        <Buttons
          sender="save"
          handleAddPlayer={handleAddPlayer}
          handleVisibility={handleVisibility}
        />
        <Buttons sender="abort" handleVisibility={handleVisibility} />
      </View>
    </View>
  );
};

export default NewPlayerForm;

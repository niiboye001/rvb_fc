import React, { useState } from "react";
import { TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import colors from "tailwindcss/colors";
import Buttons from "./Buttons";
import Subtitles from "./Subtitles";

const NewPlayerForm = () => {
  const [newPlayer, setNewPlayer] = useState("");
  const [phone, setPhone] = useState("");
  const [team, setTeam] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Forward", value: "forward" },
    { label: "Midfielder", value: "midfielder" },
    { label: "Defender", value: "defender" },
    { label: "Goalkeeper", value: "goalkeeper" },
  ]);

  return (
    <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-2">
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
            items={items}
            setOpen={setOpen}
            setValue={setTeam}
            setItems={setItems}
            placeholder="Select team"
            style={{ borderColor: "#ccc" }}
            labelStyle={{ fontSize: 15, color: colors.slate[500] }}
            dropDownContainerStyle={{ borderColor: "#ccc" }}
          />
        </View>
      </View>
      <View className="flex-row items-center justify-end gap-2">
        <Buttons sender="save" />
        <Buttons sender="abort" />
      </View>
    </View>
  );
};

export default NewPlayerForm;

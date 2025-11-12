import React, { useState } from "react";
import { TextInput, View } from "react-native";
import Buttons from "./Buttons";
import Subtitles from "./Subtitles";

const NewPlayerForm = () => {
  const [newPlayer, setNewPlayer] = useState("");
  const [phone, setPhone] = useState("");
  const [team, setTeam] = useState("");

  return (
    <View className="px-7 py-5 bg-white mx-3 my-3 rounded-lg flex flex-col gap-2">
      <Subtitles subtitle="New player form" />
      <View className="pt-7 pb-3 flex flex-col gap-5">
        <TextInput
          value={newPlayer}
          onChangeText={() => {}}
          placeholder="Player's Name..."
          className="border border-slate-300 p-3 rounded-lg text-[17px] text-slate-600"
        />
        <TextInput
          value={phone}
          onChangeText={() => {}}
          placeholder="Phone Number..."
          className="border border-slate-300 p-3 rounded-lg text-[17px] text-slate-600"
        />
        <TextInput
          value={team}
          onChangeText={() => {}}
          placeholder="Team..."
          className="border border-slate-300 p-3 rounded-lg text-[17px] text-slate-600"
        />
      </View>
      <View className="flex-row items-center justify-end gap-2">
        <Buttons sender="save" />
        <Buttons sender="abort" />
      </View>
    </View>
  );
};

export default NewPlayerForm;

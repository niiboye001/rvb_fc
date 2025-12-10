import { MatchDetailType } from "@/app/(tabs)/home";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as colors from "tailwindcss/colors";

type Team = { label: string; value: Id<"teams"> };

type MatchFormProps = {
  teams: Team[];
  onSubmit: (match: {
    homeTeamId: Id<"teams">;
    awayTeamId: Id<"teams">;
    date?: string;
    homeScore?: number;
    awayScore?: number;
    seasonId: Id<"seasons">;
  }) => void;
  setShowScorelineForm: React.Dispatch<React.SetStateAction<boolean>>;
  onSaved: React.Dispatch<React.SetStateAction<MatchDetailType | undefined>>;
  onLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MatchForm: React.FC<MatchFormProps> = ({
  teams,
  onSubmit,
  onSaved,
  onLoading,
  setIsVisible,
  setShowScorelineForm,
}) => {
  const [homeTeam, setHomeTeam] = useState<Id<"teams"> | null>(null);
  const [awayTeam, setAwayTeam] = useState<Id<"teams"> | null>(null);
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [disabledField, setDisabledField] = useState("Away Team");

  const [openHome, setOpenHome] = useState(false);

  const currSeason = useQuery(api.seasons.getCurrSeason);

  const handleSubmit = () => {
    if (!homeTeam || !awayTeam) {
      alert("Please select both teams");
      return;
    }

    if (!currSeason) return;
    onSubmit({
      homeTeamId: homeTeam,
      awayTeamId: awayTeam,
      seasonId: currSeason?._id,
      homeScore: homeScore ? parseInt(homeScore, 10) : undefined,
      awayScore: awayScore ? parseInt(awayScore, 10) : undefined,
      date: date.toISOString().split("T")[0], // YYYY-MM-DD
    });

    // Reset form
    setHomeTeam(null);
    setAwayTeam(null);
    setHomeScore("");
    setAwayScore("");
    setDate(new Date());

    onLoading(true);
    onSaved(undefined);
    setIsVisible(false);
    setShowScorelineForm(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setShowScorelineForm(false);
  };

  const handleChange = () => {
    if (!homeTeam) return;

    // if (!teams) return;

    if (homeTeam.toString() === teams[0].value) {
      setAwayTeam(teams[1].value);
      setDisabledField(teams[1].label);
    } else if (homeTeam.toString() === teams[1].value) {
      setAwayTeam(teams[0].value);
      setDisabledField(teams[0].label);
    }
  };

  return (
    <ScrollView className="bg-white flex-1 pb-5">
      {/* <Subtitles subtitle="add match" /> */}

      {/* Home Team */}
      <Text className="mt-4 mb-1 text-[14px] font-semibold text-slate-400">Home Team</Text>
      <View>
        <DropDownPicker
          flatListProps={{ scrollEnabled: false }}
          open={openHome}
          value={homeTeam}
          items={teams}
          setOpen={setOpenHome}
          setValue={setHomeTeam}
          // setItems={setItems}
          onChangeValue={handleChange}
          placeholder="Select Home Team"
          style={{ borderColor: "#ccc" }}
          labelStyle={{ fontSize: 15, color: colors.slate[500] }}
          dropDownContainerStyle={{ borderColor: "#ccc" }}
        />
      </View>

      {/* Away Team */}
      {/* <Text className="mt-4 mb-1 text-[14px] font-semibold text-slate-400">Away Team</Text> */}
      <View>
        <TextInput
          className="border border-slate-200 bg-slate-50 pl-3 py-4 rounded-lg flex-1 text-[15px] text-slate-500 mt-5"
          placeholder="Away Team"
          value={disabledField}
          editable={false}
          selectTextOnFocus={false}
        />
      </View>

      {/* Scores */}
      <Text className="mt-4 mb-1 text-[14px] font-semibold text-slate-400">Scores</Text>
      <View className="flex-row gap-4">
        <TextInput
          keyboardType="numeric"
          className="border border-slate-400 py-4 rounded-lg flex-1 text-center text-[15px] text-slate-500"
          placeholder="Home"
          value={homeScore}
          onChangeText={setHomeScore}
        />
        <TextInput
          keyboardType="numeric"
          className="border border-slate-400 py-4 rounded-lg flex-1 text-center text-[15px] text-slate-500"
          placeholder="Away"
          value={awayScore}
          onChangeText={setAwayScore}
        />
      </View>

      {/* Date */}
      <Text className="mt-4 mb-1 text-[14px] font-semibold text-slate-400">Match Date</Text>
      <TouchableOpacity
        className="border border-slate-400 py-4 rounded-lg pl-2"
        onPress={() => setShowDatePicker(true)}>
        <Text className="text-slate-500">{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Submit */}
      <View className="flex-row items-center justify-center gap-2 pt-6">
        <LinearGradient
          colors={[colors.green[500], colors.green[600]]}
          style={{ borderRadius: 5, flex: 1 }}>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 py-5"
            activeOpacity={0.8}
            onPress={handleSubmit}>
            <Text className="text-white font-semibold ml-2 text-[17px]">Add Match</Text>
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
    </ScrollView>
  );
};

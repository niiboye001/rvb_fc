import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MatchPickerBottomSheet from "./MatchPicker"; // <-- your uploaded file

type PlayersType = { label: string; value: Id<"players"> };
type MatchesType = { label: string; value: Id<"matches"> };
type CardType = { label: string; value: string };

type MatchDoc = {
  _id: Id<"matches">;
  _creationTime: number;
  homeTeamId: Id<"teams">;
  awayTeamId: Id<"teams">;
  season: Id<"seasons">;
  homeScore?: number;
  awayScore?: number;
  date?: string;
  homeTeamName: string;
  awayTeamName: string;
};

const BookingsPage = () => {
  const [playerName, setPlayerName] = useState("");
  const [matchPickerOpen, setMatchPickerOpen] = useState(false);
  //   const [selectedMatch, setSelectedMatch] = useState(null);

  const [openMatch, setOpenMatch] = useState(false);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [openCardType, setOpenCardType] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [openMatchSheet, setOpenMatchSheet] = useState(false);

  const [player, setPlayer] = useState<Id<"players"> | null>(null);
  //   const [match, setMatch] = useState<Id<"matches"> | null>(null);

  const [searchText, setSearchText] = useState("");

  const matchesQuery = useQuery(api.seasons.getMatchesBySeason);
  const matches = matchesQuery ?? [];

  const validMatches = useMemo(() => {
    return matches
      .filter((m): m is MatchDoc & { date: string } => !!m.date) // only matches with date
      .map((m) => ({
        _id: m._id,
        homeTeamName: m.homeTeamName ?? "Unknown",
        awayTeamName: m.awayTeamName ?? "Unknown",
        date: m.date,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
      }));
  }, [matches]);

  //   console.log(validMatches);

  const selectedMatch = validMatches.find((m) => m._id === matchId);

  const players: PlayersType[] =
    useQuery(api.players.getPlayers)?.map((p) => ({
      label: p.name,
      value: p._id,
    })) ?? [];

  const filteredPlayers =
    searchText.length > 0 ?
      players.filter((t) => t.label.toLowerCase().includes(searchText.toLowerCase()))
    : [];

  // Example match data — replace with your real matches
  //   const matches = []; // From Convex query

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* MAIN PAGE */}
      <View className="flex-1 bg-white px-4 pt-6">
        {/* PAGE TITLE */}
        <Text className="text-2xl font-bold text-slate-800 mb-8">Add Booking</Text>

        {/* PLAYER NAME */}
        <Text className="text-base text-slate-700 mb-1">Player Name</Text>
        <TextInput
          placeholder="Enter player name"
          value={playerName}
          onChangeText={setPlayerName}
          className="border border-slate-300 rounded-xl px-4 py-3 mb-6"
        />

        {/* SELECT MATCH */}
        <Text className="text-base text-slate-700 mb-1">Select Match</Text>
        <TouchableOpacity
          className="border border-slate-300 rounded-xl px-4 py-4 mb-4"
          onPress={() => setMatchPickerOpen(true)}>
          <Text className="text-base text-slate-700">
            {selectedMatch ?
              `${selectedMatch.homeTeamName} vs ${selectedMatch.awayTeamName} • ${
                selectedMatch.date ?? ""
              }${
                (
                  typeof selectedMatch.homeScore === "number" &&
                  typeof selectedMatch.awayScore === "number"
                ) ?
                  ` • ${selectedMatch.homeScore}-${selectedMatch.awayScore}`
                : ""
              }`
            : "Tap to select match"}
          </Text>
        </TouchableOpacity>

        {/* BUTTONS OR OTHER FIELDS */}
      </View>

      {/* MATCH PICKER BOTTOM SHEET */}
      <MatchPickerBottomSheet
        open={matchPickerOpen}
        setOpen={setMatchPickerOpen}
        matches={matches}
        onSelect={(match) => setMatchId(match?._id)}
      />
    </KeyboardAvoidingView>
  );
};

export default BookingsPage;

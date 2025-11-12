import SquadList from "@/components/SquadList";
import Subtitles from "@/components/Subtitles";
import React from "react";
import { Text, View } from "react-native";
const LeagueTableScreen = () => {
  const tableHead = ["TEAM", "GF", "GA", "GD", "POINTS"];
  const tableData = [
    ["Team Blue", 0, 0, 0, 0],
    ["Team Red", 0, 0, 0, 0],
  ];

  return (
    <>
      <View className="px-7 py-5 bg-white mx-3 my-3 rounded-lg flex flex-col gap-2">
        <Subtitles subtitle="Table" />

        {/* TABLE HEAD */}
        <View className="flex-row border-b border-slate-100 pb-2 mt-3">
          <View className="w-[32%]">
            <Text className="text-slate-400 text-[12px] uppercase font-bold">Team</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase font-bold">GF</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase font-bold">GA</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase font-bold">GD</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase font-bold">Points</Text>
          </View>
        </View>

        {/* TABLE DATA - FIRST ROW */}
        <View className="flex-row border-b border-slate-100 pb-2">
          <View className="w-[32%]">
            <Text className="text-slate-400 text-[12px] uppercase">Blue </Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase">0</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase">0</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase">0</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase">0</Text>
          </View>
        </View>

        {/* TABLE DATA - SECOND ROW */}
        <View className="flex-row border-b border-slate-100 pb-2">
          <View className="w-[32%]">
            <Text className="text-slate-400 text-[12px] uppercase">Red </Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase">0</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase">0</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase">0</Text>
          </View>
          <View className="w-[17%]">
            <Text className="text-slate-400 text-[12px] uppercase">0</Text>
          </View>
        </View>
        {/* <View className="pt-2">
        <Table>
          <Row
            data={tableHead}
            style={{
              height: 30,
              borderBottomWidth: 1,
              borderBottomColor: colors.slate[100],
            }}
            textStyle={{
              color: colors.slate[400],
              fontSize: 12,
              fontWeight: "bold",
            }}
          />
          <Rows
            data={tableData}
            style={{ height: 30, borderBottomWidth: 1, borderBottomColor: colors.slate[100] }}
            textStyle={{ color: colors.slate[400], fontSize: 12 }}
          />
        </Table>
      </View> */}
      </View>

      {/* SQUAD LIST */}
      <View className="px-7 py-5 bg-white mx-3 my-3 rounded-lg flex flex-col gap-2">
        <Subtitles subtitle="squad list" />
        <SquadList />
      </View>
    </>
  );
};

export default LeagueTableScreen;

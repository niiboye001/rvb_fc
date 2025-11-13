import NewPlayerForm from "@/components/NewPlayerForm";
import SquadList from "@/components/SquadList";
import Subtitles from "@/components/Subtitles";
import useApp from "@/hooks/useAppContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as colors from "tailwindcss/colors";

const LeagueTableScreen = () => {
  // const [isShowPlayerForm, setIsShowPlayerForm] = useState<boolean | undefined>(false);
  const { isShowing, toggleVisibility } = useApp();

  return (
    <TouchableWithoutFeedback>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 10 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={15}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-2">
            <Subtitles subtitle="Table" />

            {/* TABLE HEAD */}
            <View className="flex-row border-b border-slate-100 pb-2 mt-3">
              <View className="w-[20%]">
                <Text className="text-slate-500 text-[15px] uppercase font-semibold">Team</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase font-semibold">P</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase font-semibold">W</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase font-semibold">D</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase font-semibold">L</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase font-semibold">G+</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase font-semibold">G-</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase font-semibold">GD</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase font-semibold">pts</Text>
              </View>
            </View>

            {/* TABLE DATA - FIRST ROW */}
            <View className="flex-row border-b border-slate-100 pb-2">
              <View className="w-[20%]">
                <Text className="text-slate-600 text-[14px] uppercase font-light">Blue </Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[13px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-600 text-[13px] font-extrabold">0</Text>
              </View>
            </View>

            {/* TABLE DATA - SECOND ROW */}
            <View className="flex-row border-b border-slate-100 pb-2">
              <View className="w-[20%]">
                <Text className="text-slate-600 text-[14px] uppercase font-light">Red</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-500 text-[14px] uppercase">0</Text>
              </View>
              <View className="w-[10%]">
                <Text className="text-slate-600 text-[14px] font-extrabold">0</Text>
              </View>
            </View>
          </View>

          <View className="mt-5 flex items-end">
            <TouchableOpacity activeOpacity={0.9} onPress={toggleVisibility}>
              <View className="flex flex-row items-center justify-end w-[32%]">
                <LinearGradient
                  colors={[colors.blue[400], colors.blue[600]]}
                  style={{ borderRadius: 10, padding: 10 }}>
                  <View className="flex-row items-center justify-center gap-2">
                    <Ionicons name="add" size={20} color={colors.white} />
                    <Text className="text-white pr-1 text-[14px]">Add player</Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>

          {/* SQUAD LIS0 */}
          {!isShowing ?
            <View className="px-7 py-5 bg-white my-3 rounded-lg flex flex-col gap-2">
              <Subtitles subtitle="squad list" />
              <SquadList />
            </View>
          : <NewPlayerForm />}
        </ScrollView>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LeagueTableScreen;

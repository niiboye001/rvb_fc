import NoData from "@/components/NoData";
import ScoreBoardCard from "@/components/ScoreBoardCard";
import Subtitles from "@/components/Subtitles";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";

const CurrentResultScreen = () => {
  const data = null;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-7 py-5 bg-white mx-3 my-3 rounded-lg flex flex-col gap-7">
        <Subtitles subtitle="Scoreline" />
        {data ?
          <View className="flex flex-row gap-5 items-center justify-between">
            <ScoreBoardCard score="3" sender="red" />
            <View className="w-10 h-1 bg-slate-600 flex items-center justify-center rounded-lg"></View>
            <ScoreBoardCard score="1" sender="blue" />
          </View>
        : <NoData />}
      </View>
      <View className="px-7 py-5 bg-white mx-3 my-3 rounded-lg flex flex-col gap-7">
        <Subtitles subtitle="Scorers and Assists" />
        {data ?
          <>
            <View className="flex flex-row gap-5 items-center justify-between">
              <View className="">
                <Text className="italic font-semibold text-slate-600">Scorers</Text>
              </View>
              <View>
                <Text className="italic font-semibold text-slate-600">Assist Providers</Text>
              </View>
            </View>
            <View></View>
          </>
        : <NoData />}
      </View>
      <View className="flex flex-row items-center justify-center gap-2 p-2">
        <Text className="uppercase text-slate-500 pr-1">Click here </Text>
        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.blue[300], colors.blue[400]]}
            style={{ borderRadius: 50, padding: 10 }}>
            <Ionicons name="add" size={20} color={colors.blue[500]} />
          </LinearGradient>
        </TouchableOpacity>
        <Text className="uppercase text-slate-500 pr-1">to add today's match result. </Text>
      </View>
    </ScrollView>
  );
};

export default CurrentResultScreen;

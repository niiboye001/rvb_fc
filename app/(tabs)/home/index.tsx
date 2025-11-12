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
      {data ?
        <>
          {/* SCORELINE */}
          <View className="px-7 py-5 bg-white mx-3 my-3 rounded-lg flex flex-col gap-7">
            <Subtitles subtitle="Scoreline" />
            <View className="flex flex-row gap-5 items-center justify-between">
              <ScoreBoardCard score="3" sender="red" />
              <View className="w-10 h-1 bg-slate-600 flex items-center justify-center rounded-lg"></View>
              <ScoreBoardCard score="1" sender="blue" />
            </View>
          </View>

          {/* SCORERES AND ASSIST PROVIDERS */}
          <View className="px-7 py-5 bg-white mx-3 my-3 rounded-lg flex flex-col gap-7">
            <Subtitles subtitle="Scorers and Assist Providers" />
            <View className="flex flex-row gap-5 items-center justify-between">
              <View className="">
                <Text className="italic font-semibold text-slate-600">Scorers</Text>
              </View>
              <View>
                <Text className="italic font-semibold text-slate-600">Assist Providers</Text>
              </View>
            </View>
            <View></View>
          </View>

          {/* BOOKINGS */}
          <View className="px-7 py-5 bg-white mx-3 my-3 rounded-lg flex flex-col gap-7">
            <Subtitles subtitle="Bookings" />
            <View className="flex flex-row gap-5 items-center justify-between">
              <View className="">
                <Text className="italic font-semibold text-slate-600">Scorers</Text>
              </View>
              <View>
                <Text className="italic font-semibold text-slate-600">Assist Providers</Text>
              </View>
            </View>
            <View></View>
          </View>
        </>
      : <View className="flex flex-col items-center justify-center gap-2 pt-[150px]">
          <NoData />
          <TouchableOpacity activeOpacity={0.8}>
            <View className="flex flex-row items-center justify-center gap-3 bg-slate-200 rounded-l-full rounded-r-full p-2">
              <LinearGradient
                colors={[colors.slate[300], colors.slate[400]]}
                style={{ borderRadius: 50, padding: 10 }}>
                <Ionicons name="add" size={20} color={colors.slate[500]} />
              </LinearGradient>
              <Text className="text-slate-400 font-semibold pr-1 text-[15px]">
                Add today's match details.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      }
    </ScrollView>
  );
};

export default CurrentResultScreen;

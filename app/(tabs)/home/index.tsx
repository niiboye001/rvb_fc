import NoMatch from "@/components/NoMatch";
import ScoreBoardCard from "@/components/ScoreBoardCard";
import Subtitles from "@/components/Subtitles";
import { ScrollView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CurrentResultScreen = () => {
  const data = null;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 10 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={15}>
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
        : <NoMatch />}
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default CurrentResultScreen;

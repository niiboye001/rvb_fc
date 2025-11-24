import React from "react";
import { Text, View } from "react-native";

const NoData = () => {
  return (
    <View className="flex flex-col items-center justify-center gap-2 pt-[10px]">
      <View className="flex items-center justify-center py-2 rounded-lg">
        <Text className="text-slate-300 text-4xl font-extrabold">No data</Text>
        <Text className="text-slate-400 text-[17px] text-center py-3 px-3">
          Click any of the buttons above to add scoreline, bookings or goal contributors!
        </Text>
      </View>
    </View>
  );
};

export default NoData;

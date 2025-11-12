import React from "react";
import { Text, View } from "react-native";

const NoData = () => {
  return (
    <View className="flex items-center justify-center py-2 rounded-lg">
      <Text className="text-slate-300 text-3xl font-extrabold">No data</Text>
    </View>
  );
};

export default NoData;

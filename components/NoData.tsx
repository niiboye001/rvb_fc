import React from "react";
import { Text, View } from "react-native";

const NoData = () => {
  return (
    <View className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-lg">
      <Text className="uppercase text-slate-500">No data</Text>
    </View>
  );
};

export default NoData;

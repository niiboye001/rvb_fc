import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import * as colors from "tailwindcss/colors";

const LoadingSpinner = () => {
  return (
    <View className="flex flex-col h-72 items-center justify-center">
      <ActivityIndicator size="large" color={colors.slate[400]} />
      <Text>Loading data...</Text>
    </View>
  );
};

export default LoadingSpinner;

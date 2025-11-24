import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import * as colors from "tailwindcss/colors";

const LoadingSpinner = ({ title = "" }) => {
  return (
    <View className="flex flex-col h-72 items-center justify-center">
      <ActivityIndicator size="large" color={colors.slate[400]} />
      {title === "standings" && <Text>Loading standings and players data...</Text>}
      {title === "other" && <Text>Loading data...</Text>}
    </View>
  );
};

export default LoadingSpinner;

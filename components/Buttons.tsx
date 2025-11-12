import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as colors from "tailwindcss/colors";

const Buttons = ({ sender = "" }) => {
  return (
    <TouchableOpacity activeOpacity={0.6}>
      <LinearGradient
        colors={
          sender === "save" ?
            [colors.green[500], colors.green[700]]
          : [colors.slate[500], colors.slate[700]]
        }
        style={{ borderRadius: 5, padding: 8 }}>
        <View className="flex-row items-center justify-center gap-2 px-2 py-1">
          {sender === "save" && (
            <>
              <Text className="text-white">Save</Text>
              <Ionicons name="checkmark" color={colors.white} />
            </>
          )}
          {sender === "abort" && (
            <>
              <Ionicons name="close" color={colors.white} size={13} />
              <Text className="text-white text-[17px]">Cancel</Text>
            </>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Buttons;

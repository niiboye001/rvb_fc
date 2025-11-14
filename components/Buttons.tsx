import useApp from "@/hooks/useAppContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as colors from "tailwindcss/colors";

type ButtonType = {
  sender: "save" | "abort";
  handleAddPlayer?: () => void;
};

const Buttons = ({ sender, handleAddPlayer }: ButtonType) => {
  const { toggleVisibility } = useApp();

  const handleButton = () => {
    if (sender === "save") {
      handleAddPlayer?.();
    }

    toggleVisibility();
  };

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={handleButton}>
      <LinearGradient
        colors={
          sender === "save" ?
            [colors.green[500], colors.green[700]]
          : [colors.red[500], colors.red[700]]
        }
        style={{ borderRadius: 5, padding: 8 }}>
        <View className="flex-row items-center justify-center gap-2 px-5 py-2">
          {sender === "save" && (
            <>
              <Text className="text-white text-[15px]">Save</Text>
              <Ionicons name="checkmark" color={colors.white} />
            </>
          )}
          {sender === "abort" && (
            <>
              <Ionicons name="close" color={colors.white} size={13} />
              <Text className="text-white text-[15px]">Cancel</Text>
            </>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Buttons;

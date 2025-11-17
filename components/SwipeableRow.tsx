import React, { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import * as colors from "tailwindcss/colors";

interface SwipeType {
  children: ReactNode;
  onDelete: () => void;
}

const SwipeableRow = ({ children, onDelete }: SwipeType) => {
  const renderRightActions = () => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.red[600],
        justifyContent: "center",
        alignItems: "center",
        width: 50,
      }}>
      {/* <Ionicons name="trash" size={12} color={colors.white} /> */}
      <Text className="text-[11px] text-white">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} rightThreshold={80}>
      {children}
    </Swipeable>
  );
};

export default SwipeableRow;

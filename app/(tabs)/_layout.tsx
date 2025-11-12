import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const BottomTabsLayout = () => {
  return (
    <>
      <View className="pt-[60px] pb-[30px] bg-white px-7">
        <Text className="text-2xl font-bold justify-center text-slate-700">R v B FC</Text>
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarActiveTintColor: "#000",
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Records",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={focused ? size + 2 : size} />
            ),
          }}
        />
        <Tabs.Screen
          name="finance"
          options={{
            title: "Finance",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? "cash" : "cash-outline"} size={focused ? size + 2 : size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={focused ? size + 2 : size}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default BottomTabsLayout;

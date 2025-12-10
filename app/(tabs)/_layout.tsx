import FilterSection from "@/components/FilterSection";
import { api } from "@/convex/_generated/api";
import { useActiveNestedTab } from "@/hooks/useActiveTopTab";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useMutation } from "convex/react";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const BottomTabsLayout = () => {
  const ensureYear = useMutation(api.teams.ensureYearExists);
  const activeTab = useActiveNestedTab("(tabs)", "home");

  useEffect(() => {
    ensureYear();
  }, []);

  const isPlayerStats = activeTab === "playerStats";

  return (
    <>
      <View className="bg-slate-900 pt-[70px] px-7 flex-col">
        <View className="w-1/2 mb-5">
          <Text className="text-4xl font-bold justify-center text-slate-300">R v B FC</Text>
        </View>
        {isPlayerStats && (
          <View className="flex-row">
            <View className="w-1/3"></View>
            <View className="w-2/3">
              <FilterSection />
            </View>
          </View>
        )}
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

import FilterSection from "@/components/FilterSection";
import { api } from "@/convex/_generated/api";
import { useActiveNestedTab } from "@/hooks/useActiveTopTab";
import { useFilters } from "@/hooks/useFilter";
import { useYear } from "@/hooks/useYears";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useMutation } from "convex/react";
import { router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as colors from "tailwindcss/colors";

// interface YearType {
//   year: string;
//   yearId: string;
// }
// interface YearOverview {
//   years: YearType[];
// }

const BottomTabsLayout = () => {
  const { setFilters } = useFilters();
  const ensureYear = useMutation(api.teams.ensureYearExists);
  const activeTab = useActiveNestedTab("(tabs)", "home");

  const { years: yearsList } = useYear();
  const [selectedYear, setSelectedYear] = useState<string>(yearsList[0]?.year);
  const yearsOptions = yearsList.map((y) => ({ label: y?.year, value: y?.year }));

  const isPlayerStats = activeTab === "playerStats";
  const isSeasons = activeTab === "seasons";

  useEffect(() => {
    ensureYear();
  }, []);

  useEffect(() => {
    if (!isPlayerStats) setFilters({});
  }, [isPlayerStats]);

  // useEffect(() => {
  //   // if (!isSeasons) {
  //   //   setSelectedYear("");
  //   // }

  //   setSelectedYear(yearsList[0]?.year);

  //   router.push({ pathname: "/home/seasons", params: { chosenYear: selectedYear } });
  // }, [yearsList[0]?.year]);

  const handleSelectedYear = (item: { label: string; value: string }) => {
    setSelectedYear(item.value);
    router.push({ pathname: "/home/seasons", params: { chosenYear: item.value } });
  };

  // console.log(selectedYear);

  return (
    <>
      <StatusBar barStyle="light-content" />

      <View className="bg-slate-800 pt-4 px-7 flex-col">
        {isPlayerStats && (
          <View className="flex items-center justify-center">
            <View className="w-1/3"></View>
            <View className="w-2/3">
              <FilterSection />
            </View>
          </View>
        )}

        {isSeasons && (
          <View className="flex items-center justify-center">
            <View className="w-[40%] bg-slate-900 rounded-lg px-3">
              <Dropdown
                data={yearsOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Year"
                value={selectedYear}
                onChange={(item) => handleSelectedYear(item)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}
                selectedTextStyle={{ fontSize: 18, color: colors.slate[300] }}
                placeholderStyle={{ color: colors.slate[300] }}
              />
            </View>
          </View>
        )}
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
          tabBarItemStyle: { paddingTop: 5 },
          tabBarActiveTintColor: "#000",
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Records",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={size - 3} />
            ),
          }}
        />
        <Tabs.Screen
          name="finance"
          options={{
            title: "Finance",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? "cash" : "cash-outline"} size={size - 3} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? "options" : "options-outline"} size={size - 3} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default BottomTabsLayout;

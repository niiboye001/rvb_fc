import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { View } from "react-native";
import * as colors from "tailwindcss/colors";

const TopTabs = createMaterialTopTabNavigator();
const HomeTabs = withLayoutContext(TopTabs.Navigator);

const TopTabsLayout = () => {
  return (
    <View className="flex-1">
      <HomeTabs
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: `${colors.slate[300]}`,
          tabBarInactiveTintColor: `${colors.slate[600]}`,
          tabBarIndicatorStyle: { backgroundColor: colors.slate[100] },
          tabBarItemStyle: { width: "auto" },
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 17 },
          tabBarStyle: { backgroundColor: colors.slate[900] },
          tabBarBounces: true,
          swipeEnabled: true,
          animationEnabled: true,
        }}>
        <HomeTabs.Screen name="index" options={{ title: "Current Result" }} />
        <HomeTabs.Screen name="leagueTable" options={{ title: "League Table" }} />
        <HomeTabs.Screen name="playerStats" options={{ title: "Player Stats" }} />
        <HomeTabs.Screen name="seasons" options={{ title: "Seasons" }} />
      </HomeTabs>
    </View>
  );
};

export default TopTabsLayout;

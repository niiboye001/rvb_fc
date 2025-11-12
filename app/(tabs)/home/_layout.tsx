import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import * as colors from "tailwindcss/colors";

const TopTabs = createMaterialTopTabNavigator();
const HomeTabs = withLayoutContext(TopTabs.Navigator);

const TopTabsLayout = () => {
  return (
    <HomeTabs
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarActiveTintColor: `${colors.slate[500]}`,
        tabBarInactiveTintColor: `${colors.slate[300]}`,
        tabBarIndicatorStyle: { backgroundColor: colors.slate[400] },
        tabBarLabelStyle: { fontWeight: "bold" },
        tabBarBounces: true,
      }}>
      <HomeTabs.Screen name="index" options={{ title: "CURRENT RESULT" }} />
      <HomeTabs.Screen name="leagueTable" options={{ title: "LEAGUE TABLE" }} />
      <HomeTabs.Screen name="playerStats" options={{ title: "PLAYER STATS" }} />
      <HomeTabs.Screen name="seasons" options={{ title: "SEASONS" }} />
    </HomeTabs>
  );
};

export default TopTabsLayout;

import { AppContextProvider } from "@/hooks/useAppContext";
import { FilterProvider } from "@/hooks/useFilter";
import { YearContextProvider } from "@/hooks/useYears";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import "../global.css";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ConvexProvider client={convex}>
        <FilterProvider>
          <AppContextProvider>
            <YearContextProvider>
              <SafeAreaProvider>
                <View className="bg-slate-900 px-7 pt-20 pb-3">
                  <Text className="text-4xl font-bold text-slate-300">R v B FC</Text>
                </View>
                <Stack
                  screenOptions={{
                    headerBackButtonDisplayMode: "minimal",
                  }}>
                  {/* <Stack.Screen options={{ headerShown: false }} /> */}
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="matches-screen"
                    options={{
                      presentation: "formSheet",
                      gestureDirection: "vertical",
                      animation: "default",
                      sheetGrabberVisible: false,
                      sheetInitialDetentIndex: 0,
                      sheetAllowedDetents: [0.7],
                    }}
                  />
                  <Stack.Screen
                    name="players-screen"
                    options={{
                      presentation: "formSheet",
                      gestureDirection: "vertical",
                      animation: "default",
                      sheetGrabberVisible: false,
                      sheetInitialDetentIndex: 0,
                      sheetAllowedDetents: [0.7],
                    }}
                  />
                  <Stack.Screen
                    name="assisters-screen"
                    options={{
                      title: "Top Assist Providers",
                      headerStyle: { backgroundColor: colors.slate[900] },
                      headerTintColor: colors.slate[200],
                      headerTitleStyle: { fontSize: 15 },
                    }}
                  />
                  <Stack.Screen
                    name="topscorers-screen"
                    options={{
                      title: "Top Scorers",
                      headerStyle: { backgroundColor: colors.slate[900] },
                      headerTintColor: colors.slate[100],
                      headerTitleStyle: { fontSize: 15 },
                    }}
                  />
                </Stack>
              </SafeAreaProvider>
            </YearContextProvider>
          </AppContextProvider>
        </FilterProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}

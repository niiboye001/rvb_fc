import { AppContextProvider } from "@/hooks/useAppContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ConvexProvider client={convex}>
        <AppContextProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              {/* <Stack.Screen options={{ headerShown: false }} /> */}
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="matches-screen"
                options={{
                  presentation: "formSheet",
                  gestureDirection: "vertical",
                  animation: "default",
                  sheetGrabberVisible: true,
                  sheetInitialDetentIndex: 0,
                  sheetAllowedDetents: [0.5, 1.0],
                }}
              />
              <Stack.Screen
                name="players-screen"
                options={{
                  presentation: "formSheet",
                  gestureDirection: "vertical",
                  animation: "default",
                  sheetGrabberVisible: true,
                  sheetInitialDetentIndex: 0,
                  sheetAllowedDetents: [0.5, 1.0],
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </AppContextProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}

import { AppContextProvider } from "@/hooks/useAppContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ConvexProvider client={convex}>
        <AppContextProvider>
          <Stack screenOptions={{ headerShown: false }} />;
        </AppContextProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}

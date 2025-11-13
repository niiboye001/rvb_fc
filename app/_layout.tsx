import { AppContextProvider } from "@/hooks/useAppContext";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <AppContextProvider>
      <Stack screenOptions={{ headerShown: false }} />;
    </AppContextProvider>
  );
}

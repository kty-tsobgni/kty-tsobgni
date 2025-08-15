import { Stack } from "expo-router";
import { ThemeProvider } from "./contexts/ThemeContext"; // chemin à adapter selon ton dossier

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

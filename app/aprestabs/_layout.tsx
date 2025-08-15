import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
         <Stack.Screen name="Options" options={{ headerShown: false }} />
         <Stack.Screen name="jqe" options={{ headerShown: false }} />
         <Stack.Screen name="membres" options={{ headerShown: false }} />
         <Stack.Screen name="parametres" options={{ headerShown: false }} />
         <Stack.Screen name="postes" options={{ headerShown: false }} />
         <Stack.Screen name="problemes" options={{ headerShown: false }} />
         <Stack.Screen name="statistiques" options={{ headerShown: false }} />
         <Stack.Screen name="thermographie.tsx" options={{ headerShown: false }} />
         
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

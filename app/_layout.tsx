import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import { VehicleProvider } from "../context/vehicle-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <VehicleProvider>
        <StatusBar style="light" backgroundColor="#0F172A" translucent={false} />
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: theme.background },
            }}>
            <Stack.Screen
              name="(tabs)"
              options={{ contentStyle: { backgroundColor: theme.background } }}
            />
            <Stack.Screen
              name="vehicle/[id]"
              options={{ contentStyle: { backgroundColor: theme.background } }}
            />
          </Stack>
        </View>
      </VehicleProvider>
    </SafeAreaProvider>
  );
}

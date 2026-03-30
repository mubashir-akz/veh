import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { VehicleProvider } from "../context/vehicle-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <VehicleProvider>
        <StatusBar style="light" backgroundColor="#0F172A" translucent={false} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0F172A" },
          }}
        />
      </VehicleProvider>
    </SafeAreaProvider>
  );
}

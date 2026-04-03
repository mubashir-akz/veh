import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import { AuthProvider, useAuthStore } from "../context/auth-context";
import { VehicleProvider } from "../context/vehicle-context";

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const onAuthScreen = segments[0] === "login" || segments[0] === "register";
    if (!isAuthenticated && !onAuthScreen) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return null;
}

function AppContent() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <VehicleProvider>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <AuthGate />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: theme.background },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{ contentStyle: { backgroundColor: theme.background } }}
            />
            <Stack.Screen
              name="vehicle/[id]"
              options={{ contentStyle: { backgroundColor: theme.background } }}
            />
            <Stack.Screen
              name="login"
              options={{ contentStyle: { backgroundColor: theme.background } }}
            />
            <Stack.Screen
              name="register"
              options={{ contentStyle: { backgroundColor: theme.background } }}
            />
          </Stack>
        </View>
      </VehicleProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

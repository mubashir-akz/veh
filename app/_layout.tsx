import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import { VehicleProvider } from "../context/vehicle-context";
import { tokenStorage } from "../services/api";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await tokenStorage.getToken();
      setIsAuthenticated(!!token);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

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
            {!isAuthenticated ? (
              <>
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="(tabs)"
                  options={{ contentStyle: { backgroundColor: theme.background } }}
                />
                <Stack.Screen
                  name="vehicle/[id]"
                  options={{ contentStyle: { backgroundColor: theme.background } }}
                />
              </>
            )}
          </Stack>
        </View>
      </VehicleProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
});
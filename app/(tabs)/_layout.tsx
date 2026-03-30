import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import {
  CarFront,
  Grid2x2,
  Menu,
  Plus,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_TAB_BG = "#6B7280";
const TAB_BG = "#1E293B";
const TAB_BORDER = "#334155";
const ACTIVE_TEXT = "#F8FAFC";
const INACTIVE_TEXT = "#94A3B8";
const ADD_TAB_BG = "#4C4A8E";
const ADD_TAB_BORDER = "#6E6AC2";

const TAB_ICONS: Record<string, LucideIcon> = {
  index: Grid2x2,
  vehicles: CarFront,
  add: Plus,
  more: Menu,
};

const TAB_LABELS: Record<string, string> = {
  index: "Dashboard",
  vehicles: "Vehicles",
  add: "Add",
  more: "More",
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarOuter, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const isAdd = route.name === "add";
          const Icon = TAB_ICONS[route.name] ?? Grid2x2;
          const label = TAB_LABELS[route.name] ?? route.name;
          const color = focused ? ACTIVE_TEXT : INACTIVE_TEXT;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.buttonPressable}>
              <View style={[styles.buttonContainer, isAdd && styles.addButtonContainer]}>
                {!isAdd ? (
                  <View
                    pointerEvents="none"
                    style={[styles.selectionBg, focused && styles.selectionBgActive]}
                  />
                ) : null}
                <Icon
                  size={24}
                  strokeWidth={2}
                  color={isAdd ? ACTIVE_TEXT : color}
                />
                <Text
                  style={[
                    styles.label,
                    { color: isAdd ? ACTIVE_TEXT : color },
                    focused && styles.labelActive,
                  ]}>
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#0F172A" },
      }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="vehicles" options={{ title: "Vehicles" }} />
      <Tabs.Screen name="add" options={{ title: "Add" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  tabBarInner: {
    flexDirection: "row",
    width: "100%",
    height: 76,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: TAB_BORDER,
    backgroundColor: TAB_BG,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonContainer: {
    flex: 1,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  selectionBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: ACTIVE_TAB_BG,
    opacity: 0,
  },
  selectionBgActive: {
    opacity: 1,
  },
  addButtonContainer: {
    backgroundColor: ADD_TAB_BG,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ADD_TAB_BORDER,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  labelActive: {
    fontWeight: "700",
  },
});

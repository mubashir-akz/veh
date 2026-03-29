import { Tabs } from "expo-router";
import {
  CarFront,
  Grid2x2,
  Menu,
  Plus,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ACTIVE_TAB_BG = "#6B7280";
const TAB_BG = "#2A344A";
const TAB_BORDER = "#54627A";
const ACTIVE_TEXT = "#F8FAFC";
const INACTIVE_TEXT = "#AEB6C5";
const ADD_TAB_BG = "#4C4A8E";
const ADD_TAB_BORDER = "#6E6AC2";

type TabButtonProps = {
  icon: LucideIcon;
  label: string;
  focused: boolean;
  color: string;
  onPress?: (...args: any[]) => void;
  isAdd?: boolean;
};

function TabButton({
  icon: Icon,
  label,
  focused,
  color,
  onPress,
  isAdd = false,
}: TabButtonProps) {
  const activeContainer = focused && !isAdd;

  return (
    <Pressable onPress={onPress} style={styles.buttonPressable}>
      <View
        style={[
          styles.buttonContainer,
          activeContainer && styles.buttonContainerActive,
          isAdd && styles.addButtonContainer,
        ]}>
        <Icon size={18} strokeWidth={2.2} color={isAdd ? ACTIVE_TEXT : color} />
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
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#0F172A" },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TabButton
              icon={Grid2x2}
              label="Dashboard"
              color={accessibilityState?.selected ? ACTIVE_TEXT : INACTIVE_TEXT}
              focused={Boolean(accessibilityState?.selected)}
              onPress={onPress}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: "Vehicles",
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TabButton
              icon={CarFront}
              label="Vehicles"
              color={accessibilityState?.selected ? ACTIVE_TEXT : INACTIVE_TEXT}
              focused={Boolean(accessibilityState?.selected)}
              onPress={onPress}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TabButton
              icon={Plus}
              label="Add"
              color={accessibilityState?.selected ? ACTIVE_TEXT : INACTIVE_TEXT}
              focused={Boolean(accessibilityState?.selected)}
              onPress={onPress}
              isAdd
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TabButton
              icon={Menu}
              label="More"
              color={accessibilityState?.selected ? ACTIVE_TEXT : INACTIVE_TEXT}
              focused={Boolean(accessibilityState?.selected)}
              onPress={onPress}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 8,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: TAB_BORDER,
    backgroundColor: TAB_BG,
    paddingHorizontal: 4,
    paddingVertical: 4,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: 12,
  },
  buttonContainer: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  buttonContainerActive: {
    backgroundColor: ACTIVE_TAB_BG,
  },
  addButtonContainer: {
    backgroundColor: ADD_TAB_BG,
    borderWidth: 1,
    borderColor: ADD_TAB_BORDER,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
  },
  labelActive: {
    fontWeight: "700",
  },
});

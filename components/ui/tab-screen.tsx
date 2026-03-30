import { type ReactNode } from "react";
import {
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTabBarSpacing } from "../../hooks/use-tab-bar-spacing";

type TabScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function TabScreen({ children, style }: TabScreenProps) {
  const tabBarSpacing = useTabBarSpacing();

  return (
    <SafeAreaView
      style={[style, { paddingBottom: tabBarSpacing }]}
      edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
}

import { type ReactNode } from "react";
import {
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function TabScreen({ children, style }: TabScreenProps) {
  return (
    <SafeAreaView
      style={style}
      edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
}

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FLOATING_TAB_BOTTOM_GAP, FLOATING_TAB_HEIGHT } from "../constants/layout";

export function useTabBarSpacing(extra = 12) {
  const insets = useSafeAreaInsets();

  return FLOATING_TAB_HEIGHT + Math.max(insets.bottom, FLOATING_TAB_BOTTOM_GAP) + extra;
}
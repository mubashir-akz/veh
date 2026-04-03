import { router } from "expo-router";
import {
  CarFront,
  Fuel,
  HandCoins,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TabScreen } from "../../components/ui/tab-screen";
import { theme } from "../../constants/theme";

type QuickAction = {
  key: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  onPress: () => void;
};

export default function AddScreen() {
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageSubtitle, setMessageSubtitle] = useState("");

  const showComingSoon = (title: string) => {
    setMessageTitle(title);
    setMessageSubtitle(
      "This quick-add flow is not built yet. Add Vehicle is ready to use now.",
    );
    setMessageVisible(true);
  };

  const actions: QuickAction[] = [
    {
      key: "fuel",
      title: "Add Fuel",
      subtitle: "Log a fuel entry",
      icon: Fuel,
      iconBg: "#2F7AF8",
      onPress: () => router.push("/fuel-log"),
    },
    {
      key: "service",
      title: "Add Service",
      subtitle: "Record a service",
      icon: Wrench,
      iconBg: "#11C767",
      onPress: () => router.push("/service-history"),
    },
    {
      key: "expense",
      title: "Add Expense",
      subtitle: "Track an expense",
      icon: HandCoins,
      iconBg: "#FF7A00",
      onPress: () => router.push("/expenses"),
    },
    {
      key: "vehicle",
      title: "Add Vehicle",
      subtitle: "Register a new vehicle",
      icon: CarFront,
      iconBg: "#D92DB1",
      onPress: () => router.push("/add-vehicle"),
    },
  ];

  return (
    <>
      <TabScreen style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Quick Add</Text>
              <Text style={styles.subtitle}>What would you like to add?</Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => router.replace("/(tabs)")}
            >
              <X color={theme.textOnDark} size={22} />
            </Pressable>
          </View>

          <FlatList
            data={actions}
            keyExtractor={(action) => action.key}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.gridRow}
            renderItem={({ item: action }) => {
              const Icon = action.icon;

              return (
                <Pressable style={styles.actionCard} onPress={action.onPress}>
                  <View
                    style={[
                      styles.iconTile,
                      { backgroundColor: action.iconBg },
                    ]}
                  >
                    <Icon color="#F8FAFC" size={30} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </Pressable>
              );
            }}
          />

          {/* <View style={styles.helperCard}>
            <Text style={styles.helperText}>
              Choose an action above to quickly add entries to your vehicle
              records
            </Text>
          </View> */}
        </View>
      </TabScreen>

      <Modal
        visible={messageVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMessageVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{messageTitle}</Text>
            <Text style={styles.modalSubtitle}>{messageSubtitle}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setMessageVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    color: theme.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    width: "48.2%",
    minHeight: 210,
    backgroundColor: theme.card,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  actionTitle: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  actionSubtitle: {
    color: theme.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  helperCard: {
    marginTop: 18,
    backgroundColor: theme.card,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  helperText: {
    color: theme.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.modalOverlay,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  modalCard: {
    width: "100%",
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    color: theme.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
  modalSubtitle: {
    color: theme.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  modalButton: {
    marginTop: 18,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary,
  },
  modalButtonText: {
    color: theme.primaryText,
    fontSize: 16,
    fontWeight: "700",
  },
});

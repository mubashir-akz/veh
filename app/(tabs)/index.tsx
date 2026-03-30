import { Bell, Car } from "lucide-react-native";
import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Fleet Flow</Text>
      <Text style={styles.subtitle}>Track your vehicles and expenses</Text>

      <View style={styles.row}>
        <Card icon={<Car color="#60A5FA" />} title="Vehicles" value="0" />
        <Card icon={<Bell color="#FACC15" />} title="Reminders" value="0" />
      </View>

      <View style={styles.bigCard}>
        <View style={styles.spendingTable}>
          <Text style={styles.label}>Monthly Spending</Text>

          <View style={styles.spendingRow}>
            <Text style={styles.spendingLabel}>Fuel</Text>
            <Text style={styles.spendingValue}>$0.00</Text>
          </View>

          <View style={styles.spendingRow}>
            <Text style={styles.spendingLabel}>Service</Text>
            <Text style={styles.spendingValue}>$0.00</Text>
          </View>

          <View style={styles.spendingRow}>
            <Text style={styles.spendingLabel}>Other</Text>
            <Text style={styles.spendingValue}>$0.00</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$0.00</Text>
          </View>
        </View>
      </View>

      <View style={styles.emptyCard}>
        <Car size={40} color="#94A3B8" />
        <Text style={styles.emptyText}>No vehicles added yet</Text>
        <Text style={styles.emptySub}>Tap the + button to add your first vehicle</Text>
      </View>
    </SafeAreaView>
  );
}

type CardProps = {
  icon: ReactNode;
  title: string;
  value: string;
};

function Card({ icon, title, value }: CardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>{icon}</View>
      <View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.cardText}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
    paddingBottom: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.textPrimary,
  },
  subtitle: {
    color: theme.textMuted,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: theme.card,
    padding: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    backgroundColor: theme.surface,
    padding: 10,
    borderRadius: 12,
  },
  value: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  cardText: {
    color: theme.textMuted,
  },
  bigCard: {
    marginTop: 15,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
  },
  spendingTable: {
    width: "100%",
  },
  label: {
    color: "#FDE68A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  spendingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderRow,
  },
  spendingLabel: {
    color: "#E2E8F0",
    fontSize: 16,
  },
  spendingValue: {
    color: "#FECACA",
    fontSize: 16,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
  },
  totalLabel: {
    color: theme.textOnDark,
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    color: theme.textOnDark,
    fontSize: 18,
    fontWeight: "700",
  },
  emptyCard: {
    marginTop: 20,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    color: theme.textPrimary,
    marginTop: 10,
    fontSize: 16,
  },
  emptySub: {
    color: theme.textMuted,
    marginTop: 5,
    textAlign: "center",
  },
});

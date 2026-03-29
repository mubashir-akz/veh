import { Bell, Car, TrendingUp } from "lucide-react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <Text style={styles.title}>Fleet Flow</Text>
      <Text style={styles.subtitle}>Track your vehicles and expenses</Text>

      {/* Cards Row */}
      <View style={styles.row}>
        <Card icon={<Car color="#60A5FA" />} title="Vehicles" value="0" />
        <Card icon={<Bell color="#FACC15" />} title="Reminders" value="0" />
      </View>

      {/* Spending Card */}
      <View style={styles.bigCard}>
        <View>
          <Text style={styles.label}>Monthly Spending</Text>
          <Text style={styles.amount}>$0.00</Text>
          <Text style={styles.small}>Fuel $0   Service $0</Text>
        </View>
        <View style={styles.iconBox}>
          <TrendingUp color="#22C55E" />
        </View>
      </View>

      {/* Empty State */}
      <View style={styles.emptyCard}>
        <Car size={40} color="#94A3B8" />
        <Text style={styles.emptyText}>No vehicles added yet</Text>
        <Text style={styles.emptySub}>
          Tap the + button to add your first vehicle
        </Text>
      </View>

    </SafeAreaView>
  );
}

function Card({ icon, title, value }: any) {
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
    backgroundColor: "#0F172A",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    color: "#94A3B8",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  card: {
    flex: 1,
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconWrap: {
    backgroundColor: "#334155",
    padding: 10,
    borderRadius: 12,
  },

  value: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  cardText: {
    color: "#94A3B8",
  },

  bigCard: {
    marginTop: 15,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#94A3B8",
  },

  amount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  small: {
    color: "#94A3B8",
    marginTop: 5,
  },

  iconBox: {
    backgroundColor: "#14532D",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
  },

  emptyCard: {
    marginTop: 20,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },

  emptyText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },

  emptySub: {
    color: "#94A3B8",
    marginTop: 5,
    textAlign: "center",
  },
});
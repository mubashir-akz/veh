import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CarFront, Fuel, TrendingUp, Wrench } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useVehicleStore } from "../../context/vehicle-context";

export default function VehicleDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { vehicles } = useVehicleStore();
    const vehicle = vehicles.find((v) => v.id === id);

    if (!vehicle) {
        return (
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <View style={styles.header}>
                    <Pressable style={styles.backBtn} onPress={() => router.back()}>
                        <ArrowLeft color={theme.textPrimary} size={20} />
                    </Pressable>
                </View>
                <View style={styles.notFound}>
                    <CarFront color={theme.textMuted} size={48} />
                    <Text style={styles.notFoundText}>Vehicle not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backBtn} onPress={() => router.back()}>
                    <ArrowLeft color={theme.textPrimary} size={20} />
                </Pressable>
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>{vehicle.name}</Text>
                    <Text style={styles.headerSubtitle}>Vehicle Details</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Identity card */}
                <View style={styles.card}>
                    <View style={styles.identityRow}>
                        <View style={styles.vehicleIconWrap}>
                            <CarFront color="#E2E8F0" size={30} />
                        </View>
                        <View style={styles.identityInfo}>
                            <Text style={styles.vehicleFullName}>
                                {vehicle.year} {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
                            </Text>
                            <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
                            <Text style={styles.vehicleColor}>Color: {vehicle.color}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={styles.statIconRow}>
                                <Fuel color="#60A5FA" size={16} />
                                <Text style={styles.statLabel}>Current Mileage</Text>
                            </View>
                            <Text style={styles.statValue}>{vehicle.mileage.toLocaleString()} km</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={styles.statIconRow}>
                                <TrendingUp color="#34D399" size={16} />
                                <Text style={styles.statLabel}>Total Spent</Text>
                            </View>
                            <Text style={styles.statValue}>$0.00</Text>
                        </View>
                    </View>
                </View>

                {/* Count cards */}
                <View style={styles.countRow}>
                    <View style={[styles.countCard, { flex: 1 }]}>
                        <View style={[styles.countIcon, { backgroundColor: "#2F7AF822" }]}>
                            <Fuel color="#60A5FA" size={22} />
                        </View>
                        <Text style={styles.countNum}>0</Text>
                        <Text style={styles.countLabel}>Fuel Logs</Text>
                    </View>
                    <View style={[styles.countCard, { flex: 1 }]}>
                        <View style={[styles.countIcon, { backgroundColor: "#11C76722" }]}>
                            <Wrench color="#34D399" size={22} />
                        </View>
                        <Text style={styles.countNum}>0</Text>
                        <Text style={styles.countLabel}>Services</Text>
                    </View>
                </View>

                {/* Spending breakdown */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Spending Breakdown</Text>

                    <View style={styles.breakdownRow}>
                        <View style={styles.breakdownLeft}>
                            <Fuel color="#60A5FA" size={16} />
                            <Text style={styles.breakdownLabel}>Fuel</Text>
                        </View>
                        <Text style={[styles.breakdownValue, { color: "#60A5FA" }]}>$0.00</Text>
                    </View>

                    <View style={styles.breakdownRow}>
                        <View style={styles.breakdownLeft}>
                            <Wrench color="#34D399" size={16} />
                            <Text style={styles.breakdownLabel}>Service</Text>
                        </View>
                        <Text style={[styles.breakdownValue, { color: "#34D399" }]}>$0.00</Text>
                    </View>

                    <View style={styles.breakdownRow}>
                        <View style={styles.breakdownLeft}>
                            <Text style={styles.dollarSign}>$</Text>
                            <Text style={styles.breakdownLabel}>Other Expenses</Text>
                        </View>
                        <Text style={[styles.breakdownValue, { color: "#FF7A00" }]}>$0.00</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={[styles.breakdownRow, { paddingBottom: 0 }]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>$0.00</Text>
                    </View>
                </View>

                {/* Empty state */}
                <View style={styles.card}>
                    <View style={styles.empty}>
                        <CarFront color={theme.textMuted} size={44} />
                        <Text style={styles.emptyTitle}>No records yet for this vehicle</Text>
                        <Text style={styles.emptySubtitle}>Start tracking fuel, services, and expenses</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
        gap: 14,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.card,
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: { flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: "700", color: theme.textPrimary },
    headerSubtitle: { color: theme.textMuted, fontSize: 13, marginTop: 1 },
    scroll: { padding: 20, gap: 16, paddingBottom: 40 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 20 },
    identityRow: { flexDirection: "row", alignItems: "center", gap: 16 },
    vehicleIconWrap: {
        width: 70,
        height: 70,
        borderRadius: 18,
        backgroundColor: theme.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    identityInfo: { flex: 1 },
    vehicleFullName: { color: theme.textPrimary, fontSize: 18, fontWeight: "700" },
    vehiclePlate: { color: theme.textMuted, fontSize: 14, marginTop: 4 },
    vehicleColor: { color: theme.textMuted, fontSize: 13, marginTop: 2 },
    separator: { height: 1, backgroundColor: theme.borderRow, marginVertical: 16 },
    statsRow: { flexDirection: "row" },
    statItem: { flex: 1 },
    statIconRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    statLabel: { color: theme.textMuted, fontSize: 12 },
    statValue: { color: theme.textPrimary, fontSize: 20, fontWeight: "700", marginTop: 4 },
    statDivider: { width: 1, backgroundColor: theme.borderRow, marginHorizontal: 16 },
    countRow: { flexDirection: "row", gap: 12 },
    countCard: {
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 20,
        alignItems: "flex-start",
        gap: 8,
    },
    countIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    countNum: { color: theme.textPrimary, fontSize: 28, fontWeight: "800" },
    countLabel: { color: theme.textMuted, fontSize: 13 },
    cardTitle: { color: theme.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 16 },
    breakdownRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderRow,
    },
    breakdownLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    breakdownLabel: { color: theme.textPrimary, fontSize: 15 },
    breakdownValue: { fontSize: 15, fontWeight: "600" },
    dollarSign: { color: "#FF7A00", fontSize: 16, fontWeight: "700", width: 16, textAlign: "center" },
    totalLabel: { color: theme.textPrimary, fontSize: 17, fontWeight: "700" },
    totalValue: { color: theme.textPrimary, fontSize: 17, fontWeight: "700" },
    empty: { alignItems: "center", paddingVertical: 30 },
    emptyTitle: { color: theme.textPrimary, fontSize: 16, fontWeight: "600", marginTop: 14, textAlign: "center" },
    emptySubtitle: { color: theme.textMuted, fontSize: 13, marginTop: 6, textAlign: "center" },
    notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
    notFoundText: { color: theme.textMuted, fontSize: 16 },
});

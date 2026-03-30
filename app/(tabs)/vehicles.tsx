import { router } from "expo-router";
import {
    CarFront,
    Droplet,
    Fuel,
    HandCoins,
    Wrench,
} from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVehicleStore } from "../../context/vehicle-context";
import { useTabBarSpacing } from "../../hooks/use-tab-bar-spacing";
import { theme } from "../../constants/theme";

export default function VehiclesScreen() {
    const { vehicles } = useVehicleStore();
    const tabBarSpacing = useTabBarSpacing(0);

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <FlatList
                style={styles.list}
                data={vehicles}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    {
                        flexGrow: 1,
                        paddingBottom: tabBarSpacing,
                    },
                ]}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>My Vehicles</Text>
                            <Text style={styles.subtitle}>Manage your fleet</Text>
                        </View>
                        <Pressable style={styles.addButton} onPress={() => router.push("/(tabs)/add")}>
                            <Text style={styles.addButtonText}>Add Vehicle</Text>
                        </Pressable>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <CarFront color="#94A3B8" size={44} />
                        <Text style={styles.emptyTitle}>No Vehicles Yet</Text>
                        <Text style={styles.emptyText}>Start by adding your first vehicle</Text>
                        <Pressable style={styles.emptyAction} onPress={() => router.push("/(tabs)/add")}>
                            <Text style={styles.emptyActionText}>Add Your First Vehicle</Text>
                        </Pressable>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.vehicleCard}>
                        <View style={styles.topRow}>
                            <View style={styles.vehicleIconWrap}>
                                <CarFront color="#E2E8F0" size={26} />
                            </View>
                            <View style={styles.vehicleInfo}>
                                <Text style={styles.vehicleName}>{item.name}</Text>
                                <Text style={styles.vehicleMeta}>{`${item.year} ${item.make} ${item.model}`}</Text>
                                <Text style={styles.plate}>{item.plate}</Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Fuel color="#9CA3AF" size={16} />
                                <View>
                                    <Text style={styles.infoLabel}>Mileage</Text>
                                    <Text style={styles.infoValue}>{`${item.mileage.toLocaleString()} km`}</Text>
                                </View>
                            </View>
                            <View style={styles.infoItem}>
                                <Droplet color="#9CA3AF" size={16} />
                                <View>
                                    <Text style={styles.infoLabel}>Color</Text>
                                    <Text style={styles.infoValue}>{item.color}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Fuel color="#60A5FA" size={18} />
                                <Text style={styles.statLabel}>Fuel Logs</Text>
                                <Text style={styles.statValue}>0</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Wrench color="#34D399" size={18} />
                                <Text style={styles.statLabel}>Services</Text>
                                <Text style={styles.statValue}>0</Text>
                            </View>
                            <View style={styles.statBox}>
                                <HandCoins color="#FBBF24" size={18} />
                                <Text style={styles.statLabel}>Total Spent</Text>
                                <Text style={styles.statValue}>$0</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 0,
    },
    title: {
        color: "#fff",
        fontSize: 42,
        fontWeight: "700",
    },
    subtitle: {
        color: "#94A3B8",
        marginTop: 2,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: "#4F46E5",
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    addButtonText: {
        color: "#F8FAFC",
        fontWeight: "700",
        fontSize: 16,
    },
    emptyCard: {
        marginTop: 0,
        backgroundColor: theme.card,
        borderRadius: 20,
        padding: 26,
        borderWidth: 1,
        borderColor: theme.borderSoft,
        alignItems: "center",
    },
    emptyTitle: {
        marginTop: 14,
        color: "#F8FAFC",
        fontSize: 18,
        fontWeight: "700",
    },
    emptyText: {
        marginTop: 10,
        color: "#CBD5E1",
        fontSize: 17,
    },
    emptyAction: {
        marginTop: 18,
        backgroundColor: "#4F46E5",
        borderRadius: 14,
        paddingHorizontal: 22,
        paddingVertical: 12,
    },
    emptyActionText: {
        color: "#F8FAFC",
        fontSize: 16,
        fontWeight: "700",
    },
    listContent: {
        gap: 14,
    },
    list: {
        flex: 1,
    },
    vehicleCard: {
        backgroundColor: theme.card,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.borderSoft,
    },
    topRow: {
        flexDirection: "row",
    },
    vehicleIconWrap: {
        width: 82,
        height: 82,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.surface,
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: 12,
    },
    vehicleName: {
        color: "#F8FAFC",
        fontSize: 22,
        fontWeight: "700",
    },
    vehicleMeta: {
        color: "#D1D5DB",
        marginTop: 5,
        fontSize: 16,
        fontWeight: "600",
    },
    plate: {
        color: "#9CA3AF",
        marginTop: 4,
        fontSize: 14,
    },
    separator: {
        marginTop: 14,
        height: 1,
        backgroundColor: theme.borderRow,
    },
    infoRow: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 130,
    },
    infoLabel: {
        color: "#9CA3AF",
        fontSize: 13,
    },
    infoValue: {
        color: "#F8FAFC",
        fontSize: 18,
        fontWeight: "700",
    },
    statsRow: {
        marginTop: 12,
        flexDirection: "row",
        gap: 10,
    },
    statBox: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: theme.surface,
    },
    statLabel: {
        color: "#CBD5E1",
        fontSize: 12,
        marginTop: 6,
    },
    statValue: {
        color: "#F8FAFC",
        fontSize: 32,
        fontWeight: "700",
        marginTop: 2,
    },
});

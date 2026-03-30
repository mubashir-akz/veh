import { router } from "expo-router";
import {
    CarFront,
    Droplet,
    Fuel,
    HandCoins,
    Wrench,
} from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TabScreen } from "../../components/ui/tab-screen";
import { theme } from "../../constants/theme";
import { useVehicleStore } from "../../context/vehicle-context";
import { useTabBarSpacing } from "../../hooks/use-tab-bar-spacing";

export default function VehiclesScreen() {
    const { vehicles } = useVehicleStore();
    const tabBarSpacing = useTabBarSpacing(0);

    return (
        <TabScreen style={styles.container}>
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
                        <Pressable style={styles.addButton} onPress={() => router.push("/add-vehicle")}>
                            <Text style={styles.addButtonText}>Add Vehicle</Text>
                        </Pressable>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <CarFront color="#94A3B8" size={44} />
                        <Text style={styles.emptyTitle}>No Vehicles Yet</Text>
                        <Text style={styles.emptyText}>Start by adding your first vehicle</Text>
                        <Pressable style={styles.emptyAction} onPress={() => router.push("/add-vehicle")}>
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
        </TabScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    title: {
        color: theme.textPrimary,
        fontSize: 28,
        fontWeight: "700",
    },
    subtitle: {
        color: theme.textMuted,
        marginTop: 2,
        fontSize: 14,
    },
    addButton: {
        backgroundColor: theme.primary,
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    addButtonText: {
        color: theme.primaryText,
        fontWeight: "700",
        fontSize: 14,
    },
    emptyCard: {
        marginTop: 4,
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 30,
        alignItems: "center",
    },
    emptyTitle: {
        marginTop: 14,
        color: theme.textPrimary,
        fontSize: 18,
        fontWeight: "700",
    },
    emptyText: {
        marginTop: 8,
        color: theme.textMuted,
        fontSize: 15,
    },
    emptyAction: {
        marginTop: 18,
        backgroundColor: theme.primary,
        borderRadius: 16,
        paddingHorizontal: 22,
        paddingVertical: 12,
    },
    emptyActionText: {
        color: theme.primaryText,
        fontSize: 15,
        fontWeight: "700",
    },
    listContent: {
        padding: 20,
        gap: 14,
    },
    list: {
        flex: 1,
    },
    vehicleCard: {
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 18,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    vehicleIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.surface,
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: 14,
    },
    vehicleName: {
        color: theme.textPrimary,
        fontSize: 20,
        fontWeight: "700",
    },
    vehicleMeta: {
        color: theme.textMuted,
        marginTop: 4,
        fontSize: 14,
        fontWeight: "500",
    },
    plate: {
        color: theme.textLabel,
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
        gap: 12,
    },
    infoItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: theme.surface,
    },
    infoLabel: {
        color: theme.textMuted,
        fontSize: 12,
    },
    infoValue: {
        color: theme.textPrimary,
        fontSize: 15,
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
        paddingHorizontal: 8,
        alignItems: "center",
        backgroundColor: theme.surface,
    },
    statLabel: {
        color: theme.textMuted,
        fontSize: 12,
        marginTop: 6,
        textAlign: "center",
    },
    statValue: {
        color: theme.textPrimary,
        fontSize: 24,
        fontWeight: "700",
        marginTop: 2,
    },
});

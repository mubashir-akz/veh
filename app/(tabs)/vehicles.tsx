import { router } from "expo-router";
import {
    CarFront,
    ChevronRight,
    Fuel,
} from "lucide-react-native";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TabScreen } from "../../components/ui/tab-screen";
import { theme } from "../../constants/theme";
import { useVehicleStore } from "../../context/vehicle-context";
import { useTabBarSpacing } from "../../hooks/use-tab-bar-spacing";

export default function VehiclesScreen() {
    const { vehicles, loading, error, refreshVehicles } = useVehicleStore();
    const tabBarSpacing = useTabBarSpacing(0);

    const handleRefresh = () => {
        void refreshVehicles();
    };

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
                onRefresh={handleRefresh}
                refreshing={loading}
                ListHeaderComponent={
                    <View style={styles.headerWrap}>
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.title}>My Vehicles</Text>
                                <Text style={styles.subtitle}>Manage your fleet</Text>
                            </View>
                            <Pressable style={styles.addButton} onPress={() => router.push("/add-vehicle")}>
                                <Text style={styles.addButtonText}>Add Vehicle</Text>
                            </Pressable>
                        </View>

                        {error ? (
                            <View style={styles.errorBanner}>
                                <Text style={styles.errorTitle}>Couldn&apos;t load vehicles</Text>
                                <Text style={styles.errorText}>{error}</Text>
                                <Pressable style={styles.retryButton} onPress={handleRefresh}>
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </Pressable>
                            </View>
                        ) : null}
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.emptyCard}>
                            <ActivityIndicator color={theme.primary} size="large" />
                            <Text style={styles.emptyTitle}>Loading vehicles</Text>
                            <Text style={styles.emptyText}>Fetching your latest fleet from the API.</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyCard}>
                            <CarFront color="#94A3B8" size={44} />
                            <Text style={styles.emptyTitle}>No Vehicles Yet</Text>
                            <Text style={styles.emptyText}>Start by adding your first vehicle</Text>
                            <Pressable style={styles.emptyAction} onPress={() => router.push("/add-vehicle")}>
                                <Text style={styles.emptyActionText}>Add Your First Vehicle</Text>
                            </Pressable>
                        </View>
                    )
                }
                renderItem={({ item }) => {
                    const currentMonthLabel = new Date().toLocaleString("en-US", { month: "short" });
                    const currentMonthSpending = 0;
                    const vehicleMeta = item.year > 0 ? `${item.year} ${item.make} ${item.model}` : `${item.make} ${item.model}`;

                    return (
                        <Pressable style={styles.vehicleCard} onPress={() => router.push(`/vehicle/${item.id}`)}>
                            <View style={styles.topRow}>
                                <View style={styles.vehicleIconWrap}>
                                    <CarFront color="#E2E8F0" size={20} />
                                </View>
                                <View style={styles.vehicleInfo}>
                                    <Text style={styles.vehicleName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.vehicleMeta}>{vehicleMeta}</Text>
                                </View>
                                <View style={styles.quickStats}>
                                    <Text style={styles.quickStatsLabel}>Mileage</Text>
                                    <Text style={styles.quickStatsValue}>{`${item.mileage.toLocaleString()} km`}</Text>
                                </View>
                            </View>

                            <View style={styles.badgesRow}>
                                <View style={styles.badge}>
                                    <Fuel color="#60A5FA" size={14} />
                                    <Text style={styles.badgeText}>{item.plate}</Text>
                                </View>
                                <View style={styles.badge}>
                                    <CarFront color="#34D399" size={14} />
                                    <Text style={styles.badgeText}>{`${currentMonthLabel}: $${currentMonthSpending.toFixed(2)}`}</Text>
                                </View>
                                <ChevronRight color={theme.textMuted} size={18} />
                            </View>
                        </Pressable>
                    );
                }}
            />
        </TabScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    headerWrap: {
        gap: 12,
        marginBottom: 4,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    errorBanner: {
        backgroundColor: "rgba(248, 113, 113, 0.12)",
        borderWidth: 1,
        borderColor: "rgba(248, 113, 113, 0.24)",
        borderRadius: 14,
        padding: 14,
        gap: 6,
    },
    errorTitle: {
        color: theme.primaryText,
        fontSize: 15,
        fontWeight: "700",
    },
    errorText: {
        color: theme.textLabel,
        fontSize: 13,
        lineHeight: 18,
    },
    retryButton: {
        alignSelf: "flex-start",
        marginTop: 4,
        backgroundColor: theme.primary,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    retryButtonText: {
        color: theme.primaryText,
        fontSize: 12,
        fontWeight: "700",
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
        gap: 10,
    },
    list: {
        flex: 1,
        backgroundColor: theme.background,
    },
    vehicleCard: {
        backgroundColor: theme.card,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    vehicleIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.surface,
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: 10,
    },
    vehicleName: {
        color: theme.textPrimary,
        fontSize: 16,
        fontWeight: "700",
    },
    vehicleMeta: {
        color: theme.textMuted,
        marginTop: 2,
        fontSize: 12,
        fontWeight: "500",
    },
    quickStats: {
        alignItems: "flex-end",
    },
    quickStatsLabel: {
        color: theme.textMuted,
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    quickStatsValue: {
        color: theme.textPrimary,
        fontSize: 13,
        fontWeight: "700",
        marginTop: 2,
    },
    badgesRow: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    badge: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: theme.surface,
    },
    badgeText: {
        color: theme.textPrimary,
        fontSize: 12,
        fontWeight: "600",
    },
});

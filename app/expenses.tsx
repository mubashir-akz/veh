import { router } from "expo-router";
import { ArrowLeft, HandCoins, Plus, TrendingUp, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import { useVehicleStore } from "../context/vehicle-context";

const CATEGORIES = ["Fuel", "Service", "Insurance", "Tax", "Repair", "Wash", "Parking", "Other"];

type Category = "Fuel" | "Service" | "Insurance" | "Tax" | "Repair" | "Wash" | "Parking" | "Other";

function todayIso() {
    return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
    if (!iso) {
        return "";
    }

    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) {
        return iso;
    }

    return `${d}/${m}/${y}`;
}

function computeTotals(entries: { category: string; amount: number }[]) {
    const fuel = entries.filter((e) => e.category === "Fuel").reduce((a, e) => a + e.amount, 0);
    const service = entries.filter((e) => e.category === "Service").reduce((a, e) => a + e.amount, 0);
    const other = entries.filter((e) => e.category !== "Fuel" && e.category !== "Service").reduce((a, e) => a + e.amount, 0);
    return { fuel, service, other, total: fuel + service + other };
}

export default function ExpensesScreen() {
    const { vehicles, expenses, loadExpenses, addExpense } = useVehicleStore();
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeVehicleId, setActiveVehicleId] = useState("");

    const [vehicleId, setVehicleId] = useState("");
    const [date, setDate] = useState(todayIso());
    const [category, setCategory] = useState<Category | "">("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [vehiclePickerVisible, setVehiclePickerVisible] = useState(false);
    const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
    const [error, setError] = useState("");

    const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
    const totals = computeTotals(expenses);

    useEffect(() => {
        if (vehicles.length === 0) {
            setActiveVehicleId("");
            return;
        }

        if (!activeVehicleId || !vehicles.some((vehicle) => vehicle.id === activeVehicleId)) {
            setActiveVehicleId(vehicles[0].id);
        }
    }, [activeVehicleId, vehicles]);

    useEffect(() => {
        if (!activeVehicleId) {
            return;
        }

        setIsLoading(true);
        void loadExpenses(activeVehicleId).finally(() => setIsLoading(false));
    }, [activeVehicleId, loadExpenses]);

    const openForm = () => {
        setVehicleId(activeVehicleId || vehicles[0]?.id || "");
        setDate(todayIso());
        setCategory("");
        setDescription("");
        setAmount("");
        setError("");
        setShowForm(true);
    };

    const handleAdd = async () => {
        if (isSaving) {
            return;
        }

        if (!vehicleId) {
            setError("Please select a vehicle.");
            return;
        }
        if (!category) {
            setError("Please select a category.");
            return;
        }
        const parsedAmount = parseFloat(amount);
        if (!amount.trim() || isNaN(parsedAmount) || parsedAmount < 0) {
            setError("Please enter a valid amount.");
            return;
        }

        try {
            setIsSaving(true);
            await addExpense(vehicleId, {
                date: date || todayIso(),
                category,
                amount: parsedAmount,
                description: description.trim() || undefined,
            });

            await loadExpenses(vehicleId);
            if (activeVehicleId !== vehicleId) {
                setActiveVehicleId(vehicleId);
            }
            setShowForm(false);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Failed to add expense.");
        } finally {
            setIsSaving(false);
        }
    };

    // ── Modals (shared between both views) ───────────────────
    const vehicleModal = (
        <Modal
            visible={vehiclePickerVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setVehiclePickerVisible(false)}
        >
            <Pressable style={styles.overlay} onPress={() => setVehiclePickerVisible(false)}>
                <View style={styles.sheet}>
                    <Text style={styles.sheetTitle}>Select Vehicle</Text>
                    {vehicles.length === 0 ? (
                        <Text style={styles.sheetEmpty}>No vehicles. Add one first.</Text>
                    ) : (
                        vehicles.map((v) => (
                            <Pressable
                                key={v.id}
                                style={[styles.sheetOption, vehicleId === v.id && styles.sheetOptionActive]}
                                onPress={() => {
                                    setVehicleId(v.id);
                                    setVehiclePickerVisible(false);
                                }}
                            >
                                <Text style={[styles.sheetOptionText, vehicleId === v.id && styles.sheetOptionTextActive]}>
                                    {v.year} {v.make} {v.model} ({v.plate})
                                </Text>
                            </Pressable>
                        ))
                    )}
                </View>
            </Pressable>
        </Modal>
    );

    const categoryModal = (
        <Modal
            visible={categoryPickerVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setCategoryPickerVisible(false)}
        >
            <Pressable style={styles.overlay} onPress={() => setCategoryPickerVisible(false)}>
                <View style={styles.sheet}>
                    <Text style={styles.sheetTitle}>Category</Text>
                    {CATEGORIES.map((cat) => (
                        <Pressable
                            key={cat}
                            style={[styles.sheetOption, category === cat && styles.sheetOptionActive]}
                            onPress={() => {
                                setCategory(cat as Category);
                                setCategoryPickerVisible(false);
                            }}
                        >
                            <Text style={[styles.sheetOptionText, category === cat && styles.sheetOptionTextActive]}>
                                {cat}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );

    // ── Form view ────────────────────────────────────────────
    if (showForm) {
        return (
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <Pressable style={styles.iconBtn} onPress={() => setShowForm(false)}>
                            <ArrowLeft color={theme.textPrimary} size={20} />
                        </Pressable>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.title}>Add Expense</Text>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.card}>
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <Text style={styles.label}>Vehicle *</Text>
                            <Pressable style={styles.selectField} onPress={() => setVehiclePickerVisible(true)}>
                                <Text style={[styles.selectText, !selectedVehicle && styles.placeholderText]}>
                                    {selectedVehicle
                                        ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
                                        : "Select a vehicle"}
                                </Text>
                                <Text style={styles.chevron}>▾</Text>
                            </Pressable>

                            <View style={styles.twoCol}>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Date</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={date}
                                        onChangeText={setDate}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor={theme.placeholder}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Category *</Text>
                                    <Pressable style={styles.selectField} onPress={() => setCategoryPickerVisible(true)}>
                                        <Text style={[styles.selectText, !category && styles.placeholderText]}>
                                            {category || "Select"}
                                        </Text>
                                        <Text style={styles.chevron}>▾</Text>
                                    </Pressable>
                                </View>
                            </View>

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Expense details..."
                                placeholderTextColor={theme.placeholder}
                            />

                            <Text style={styles.label}>Amount *</Text>
                            <TextInput
                                style={styles.input}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="decimal-pad"
                                placeholderTextColor={theme.placeholder}
                            />

                            <Pressable style={[styles.addBtn, isSaving && styles.disabledBtn]} onPress={() => void handleAdd()} disabled={isSaving}>
                                {isSaving ? <ActivityIndicator color="#fff" size="small" /> : null}
                                <Text style={styles.addBtnText}>{isSaving ? "Saving..." : "Add Expense"}</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {vehicleModal}
                {categoryModal}
            </SafeAreaView>
        );
    }

    // ── Listing view ─────────────────────────────────────────
    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <Pressable style={styles.iconBtn} onPress={() => router.back()}>
                    <X color={theme.textPrimary} size={20} />
                </Pressable>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.title}>Expenses</Text>
                    <Text style={styles.subtitle}>Track all vehicle costs</Text>
                </View>
                <Pressable style={styles.addFab} onPress={openForm}>
                    <Plus color="#fff" size={18} />
                    <Text style={styles.addFabText}>Add</Text>
                </Pressable>
            </View>

            {vehicles.length > 1 ? (
                <View style={styles.filterBar}>
                    {vehicles.map((vehicle) => (
                        <Pressable
                            key={vehicle.id}
                            style={[styles.filterChip, activeVehicleId === vehicle.id && styles.filterChipActive]}
                            onPress={() => setActiveVehicleId(vehicle.id)}>
                            <Text style={[styles.filterChipText, activeVehicleId === vehicle.id && styles.filterChipTextActive]} numberOfLines={1}>
                                {vehicle.name}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            ) : null}

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Summary card */}
                <View style={styles.card}>
                    <View style={styles.summaryTopRow}>
                        <Text style={styles.summaryLabel}>Total Expenses</Text>
                        <View style={styles.trendBtn}>
                            <TrendingUp color="#FF7A00" size={18} />
                        </View>
                    </View>
                    <Text style={styles.summaryAmount}>${totals.total.toFixed(2)}</Text>
                    <View style={styles.summaryBreakdown}>
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownLabel}>Fuel</Text>
                            <Text style={[styles.breakdownValue, { color: "#60A5FA" }]}>
                                ${totals.fuel.toFixed(0)}
                            </Text>
                        </View>
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownLabel}>Service</Text>
                            <Text style={[styles.breakdownValue, { color: "#34D399" }]}>
                                ${totals.service.toFixed(0)}
                            </Text>
                        </View>
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownLabel}>Other</Text>
                            <Text style={[styles.breakdownValue, { color: "#FF7A00" }]}>
                                ${totals.other.toFixed(0)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Entries / Empty state */}
                <View style={styles.card}>
                    {isLoading ? (
                        <View style={styles.empty}>
                            <ActivityIndicator color={theme.primary} size="large" />
                            <Text style={styles.emptyTitle}>Loading expenses...</Text>
                        </View>
                    ) : expenses.length === 0 ? (
                        <View style={styles.empty}>
                            <HandCoins color={theme.textMuted} size={48} />
                            <Text style={styles.emptyTitle}>No expenses yet</Text>
                            <Text style={styles.emptySubtitle}>Tap Add to log your first expense</Text>
                        </View>
                    ) : (
                        expenses.map((entry, idx) => (
                            <View
                                key={entry.id}
                                style={[styles.entryRow, idx < expenses.length - 1 && styles.entryRowBorder]}
                            >
                                <View style={styles.entryIconWrap}>
                                    <HandCoins color="#FF7A00" size={20} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.entryName}>
                                        {entry.category}{entry.description ? ` · ${entry.description}` : ""}
                                    </Text>
                                    <Text style={styles.entrySub}>
                                        {(vehicles.find((v) => v.id === entry.vehicleId)?.name) || "Vehicle"} · {formatDate(entry.date)}
                                    </Text>
                                </View>
                                <Text style={styles.entryAmount}>${entry.amount.toFixed(2)}</Text>
                            </View>
                        ))
                    )}
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
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
    },
    title: { fontSize: 28, fontWeight: "700", color: theme.textPrimary },
    subtitle: { color: theme.textMuted, fontSize: 13, marginTop: 2 },
    filterBar: {
        flexDirection: "row",
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 4,
        flexWrap: "wrap",
    },
    filterChip: {
        backgroundColor: theme.surface,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxWidth: "48%",
    },
    filterChipActive: {
        backgroundColor: "#FF7A00",
    },
    filterChipText: {
        color: theme.textMuted,
        fontSize: 12,
        fontWeight: "600",
    },
    filterChipTextActive: {
        color: "#fff",
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.card,
        alignItems: "center",
        justifyContent: "center",
    },
    scroll: { padding: 20, gap: 16, paddingBottom: 40 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 20 },
    summaryTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    summaryLabel: { color: theme.textMuted, fontSize: 14 },
    trendBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#FF7A0022",
        alignItems: "center",
        justifyContent: "center",
    },
    summaryAmount: { fontSize: 32, fontWeight: "800", color: theme.textPrimary, marginTop: 6 },
    summaryBreakdown: { flexDirection: "row", marginTop: 14, gap: 4 },
    breakdownItem: { flex: 1 },
    breakdownLabel: { color: theme.textMuted, fontSize: 12 },
    breakdownValue: { fontSize: 14, fontWeight: "700", marginTop: 2 },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.card,
        alignItems: "center",
        justifyContent: "center",
    },
    addFab: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF7A00",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 9,
        gap: 6,
    },
    addFabText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    entryIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#FF7A0022",
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: { color: theme.danger, fontSize: 13, marginTop: 8 },
    label: { color: theme.textLabel, fontSize: 13, marginBottom: 6, marginTop: 14 },
    input: {
        backgroundColor: theme.inputBackground,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        color: theme.textPrimary,
        fontSize: 15,
        borderWidth: 1,
        borderColor: theme.inputBorder,
    },
    selectField: {
        backgroundColor: theme.inputBackground,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderWidth: 1,
        borderColor: theme.inputBorder,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectText: { color: theme.textPrimary, fontSize: 15, flex: 1 },
    placeholderText: { color: theme.placeholder },
    chevron: { color: theme.textMuted, fontSize: 14 },
    twoCol: { flexDirection: "row", gap: 12 },
    col: { flex: 1 },
    addBtn: {
        backgroundColor: "#FF7A00",
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    disabledBtn: { opacity: 0.8 },
    addBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    empty: { alignItems: "center", paddingVertical: 32 },
    emptyTitle: { color: theme.textPrimary, fontSize: 16, fontWeight: "600", marginTop: 14 },
    emptySubtitle: { color: theme.textMuted, fontSize: 13, marginTop: 4 },
    entryRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 8 },
    entryRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.borderRow },
    entryName: { color: theme.textPrimary, fontSize: 14, fontWeight: "600" },
    entrySub: { color: theme.textMuted, fontSize: 12, marginTop: 2 },
    entryAmount: { color: "#FF7A00", fontSize: 15, fontWeight: "700" },
    overlay: { flex: 1, backgroundColor: theme.modalOverlay, justifyContent: "flex-end" },
    sheet: {
        backgroundColor: theme.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        maxHeight: "70%",
    },
    sheetTitle: { color: theme.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 14 },
    sheetEmpty: { color: theme.textMuted, textAlign: "center", paddingVertical: 20 },
    sheetOption: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, marginBottom: 4 },
    sheetOptionActive: { backgroundColor: theme.primary + "33" },
    sheetOptionText: { color: theme.textPrimary, fontSize: 15 },
    sheetOptionTextActive: { color: theme.primary, fontWeight: "700" },
});

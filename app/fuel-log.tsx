import { router } from "expo-router";
import { ArrowLeft, Fuel, Plus, X } from "lucide-react-native";
import { useState } from "react";
import {
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

type FuelEntry = {
    id: string;
    vehicleName: string;
    date: string;
    liters: number;
    pricePerLiter: number;
    mileage: number;
    station: string;
};

function todayStr() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function FuelLogScreen() {
    const { vehicles } = useVehicleStore();
    const [entries, setEntries] = useState<FuelEntry[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [vehicleId, setVehicleId] = useState("");
    const [date, setDate] = useState(todayStr());
    const [liters, setLiters] = useState("");
    const [pricePerLiter, setPricePerLiter] = useState("");
    const [mileage, setMileage] = useState("");
    const [station, setStation] = useState("");
    const [vehiclePickerVisible, setVehiclePickerVisible] = useState(false);
    const [error, setError] = useState("");

    const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

    const openForm = () => {
        setVehicleId("");
        setDate(todayStr());
        setLiters("");
        setPricePerLiter("");
        setMileage("");
        setStation("");
        setError("");
        setShowForm(true);
    };

    const handleAdd = () => {
        if (!vehicleId) {
            setError("Please select a vehicle.");
            return;
        }
        const parsedLiters = parseFloat(liters);
        if (!liters.trim() || isNaN(parsedLiters) || parsedLiters <= 0) {
            setError("Please enter a valid liters value.");
            return;
        }
        const vehicle = vehicles.find((v) => v.id === vehicleId)!;
        setEntries((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                date: date.trim() || todayStr(),
                liters: parsedLiters,
                pricePerLiter: parseFloat(pricePerLiter) || 0,
                mileage: parseFloat(mileage) || 0,
                station: station.trim(),
            },
        ]);
        setShowForm(false);
    };

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
                            <Text style={styles.title}>Add Fuel Entry</Text>
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
                                        placeholder="DD/MM/YYYY"
                                        placeholderTextColor={theme.placeholder}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Liters *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={liters}
                                        onChangeText={setLiters}
                                        keyboardType="decimal-pad"
                                        placeholderTextColor={theme.placeholder}
                                    />
                                </View>
                            </View>

                            <View style={styles.twoCol}>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Price/Liter</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={pricePerLiter}
                                        onChangeText={setPricePerLiter}
                                        keyboardType="decimal-pad"
                                        placeholderTextColor={theme.placeholder}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Mileage</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={mileage}
                                        onChangeText={setMileage}
                                        keyboardType="decimal-pad"
                                        placeholderTextColor={theme.placeholder}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>Gas Station</Text>
                            <TextInput
                                style={styles.input}
                                value={station}
                                onChangeText={setStation}
                                placeholder="Shell, BP, etc."
                                placeholderTextColor={theme.placeholder}
                            />

                            <Pressable style={styles.addBtn} onPress={handleAdd}>
                                <Text style={styles.addBtnText}>Add Entry</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

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
                                        <Text
                                            style={[
                                                styles.sheetOptionText,
                                                vehicleId === v.id && styles.sheetOptionTextActive,
                                            ]}
                                        >
                                            {v.year} {v.make} {v.model} ({v.plate})
                                        </Text>
                                    </Pressable>
                                ))
                            )}
                        </View>
                    </Pressable>
                </Modal>
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
                    <Text style={styles.title}>Fuel Log</Text>
                    <Text style={styles.subtitle}>Track your fuel expenses</Text>
                </View>
                <Pressable style={styles.addFab} onPress={openForm}>
                    <Plus color="#fff" size={18} />
                    <Text style={styles.addFabText}>Add</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    {entries.length === 0 ? (
                        <View style={styles.empty}>
                            <Fuel color={theme.textMuted} size={48} />
                            <Text style={styles.emptyTitle}>No fuel entries yet</Text>
                            <Text style={styles.emptySubtitle}>Tap Add to log your first entry</Text>
                        </View>
                    ) : (
                        entries.map((entry, idx) => (
                            <View
                                key={entry.id}
                                style={[styles.entryRow, idx < entries.length - 1 && styles.entryRowBorder]}
                            >
                                <View style={styles.entryIconWrap}>
                                    <Fuel color="#60A5FA" size={18} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.entryName}>{entry.vehicleName}</Text>
                                    <Text style={styles.entrySub}>
                                        {entry.date} · {entry.liters}L
                                        {entry.station ? ` · ${entry.station}` : ""}
                                    </Text>
                                </View>
                                {entry.pricePerLiter > 0 && (
                                    <Text style={styles.entryAmount}>
                                        ${(entry.liters * entry.pricePerLiter).toFixed(2)}
                                    </Text>
                                )}
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
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
    },
    title: { fontSize: 24, fontWeight: "700", color: theme.textPrimary },
    subtitle: { color: theme.textMuted, fontSize: 13, marginTop: 2 },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.card,
        alignItems: "center",
        justifyContent: "center",
    },
    addFab: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#2F7AF8",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    addFabText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    scroll: { padding: 20, gap: 16, paddingBottom: 40 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 20 },
    errorText: { color: theme.danger, fontSize: 13, marginBottom: 8 },
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
        backgroundColor: "#2F7AF8",
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 20,
    },
    addBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    empty: { alignItems: "center", paddingVertical: 32 },
    emptyTitle: { color: theme.textPrimary, fontSize: 16, fontWeight: "600", marginTop: 14 },
    emptySubtitle: { color: theme.textMuted, fontSize: 13, marginTop: 4 },
    entryRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 12 },
    entryRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.borderRow },
    entryIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#2F7AF822",
        alignItems: "center",
        justifyContent: "center",
    },
    entryName: { color: theme.textPrimary, fontSize: 14, fontWeight: "600" },
    entrySub: { color: theme.textMuted, fontSize: 12, marginTop: 2 },
    entryAmount: { color: "#60A5FA", fontSize: 15, fontWeight: "700" },
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
    sheetOption: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 4,
    },
    sheetOptionActive: { backgroundColor: theme.primary + "33" },
    sheetOptionText: { color: theme.textPrimary, fontSize: 15 },
    sheetOptionTextActive: { color: theme.primary, fontWeight: "700" },
});

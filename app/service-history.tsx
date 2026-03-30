import { router } from "expo-router";
import { ArrowLeft, Plus, Wrench, X } from "lucide-react-native";
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

const SERVICE_TYPES = [
    "Oil Change",
    "Tire Rotation",
    "Brake Service",
    "Air Filter",
    "Battery",
    "Transmission",
    "Coolant Flush",
    "Spark Plugs",
    "Other",
];

type ServiceRecord = {
    id: string;
    vehicleName: string;
    date: string;
    serviceType: string;
    description: string;
    cost: number;
    mileage: number;
    provider: string;
};

function todayStr() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function ServiceHistoryScreen() {
    const { vehicles } = useVehicleStore();
    const [records, setRecords] = useState<ServiceRecord[]>([]);
    const [showForm, setShowForm] = useState(false);

    const [vehicleId, setVehicleId] = useState("");
    const [date, setDate] = useState(todayStr());
    const [serviceType, setServiceType] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [mileage, setMileage] = useState("");
    const [provider, setProvider] = useState("");
    const [vehiclePickerVisible, setVehiclePickerVisible] = useState(false);
    const [servicePickerVisible, setServicePickerVisible] = useState(false);
    const [error, setError] = useState("");

    const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

    const openForm = () => {
        setVehicleId("");
        setDate(todayStr());
        setServiceType("");
        setDescription("");
        setCost("");
        setMileage("");
        setProvider("");
        setError("");
        setShowForm(true);
    };

    const handleAdd = () => {
        if (!vehicleId) {
            setError("Please select a vehicle.");
            return;
        }
        if (!serviceType) {
            setError("Please select a service type.");
            return;
        }
        if (!description.trim()) {
            setError("Description is required.");
            return;
        }
        const vehicle = vehicles.find((v) => v.id === vehicleId)!;
        setRecords((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                date: date.trim() || todayStr(),
                serviceType,
                description: description.trim(),
                cost: parseFloat(cost) || 0,
                mileage: parseFloat(mileage) || 0,
                provider: provider.trim(),
            },
        ]);
        setShowForm(false);
    };

    // Shared pickers
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

    const serviceModal = (
        <Modal
            visible={servicePickerVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setServicePickerVisible(false)}
        >
            <Pressable style={styles.overlay} onPress={() => setServicePickerVisible(false)}>
                <View style={styles.sheet}>
                    <Text style={styles.sheetTitle}>Service Type</Text>
                    {SERVICE_TYPES.map((type) => (
                        <Pressable
                            key={type}
                            style={[styles.sheetOption, serviceType === type && styles.sheetOptionActive]}
                            onPress={() => {
                                setServiceType(type);
                                setServicePickerVisible(false);
                            }}
                        >
                            <Text style={[styles.sheetOptionText, serviceType === type && styles.sheetOptionTextActive]}>
                                {type}
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
                            <Text style={styles.title}>Add Service Record</Text>
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
                                    <Text style={styles.label}>Service Type *</Text>
                                    <Pressable style={styles.selectField} onPress={() => setServicePickerVisible(true)}>
                                        <Text style={[styles.selectText, !serviceType && styles.placeholderText]}>
                                            {serviceType || "Select type"}
                                        </Text>
                                        <Text style={styles.chevron}>▾</Text>
                                    </Pressable>
                                </View>
                            </View>

                            <Text style={styles.label}>Description *</Text>
                            <TextInput
                                style={[styles.input, styles.textarea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Details about the service performed..."
                                placeholderTextColor={theme.placeholder}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                            <View style={styles.twoCol}>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Cost</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={cost}
                                        onChangeText={setCost}
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

                            <Text style={styles.label}>Service Provider</Text>
                            <TextInput
                                style={styles.input}
                                value={provider}
                                onChangeText={setProvider}
                                placeholder="Mechanic or service center name"
                                placeholderTextColor={theme.placeholder}
                            />

                            <Pressable style={styles.addBtn} onPress={handleAdd}>
                                <Text style={styles.addBtnText}>Add Record</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {vehicleModal}
                {serviceModal}
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
                    <Text style={styles.title}>Service History</Text>
                    <Text style={styles.subtitle}>Track maintenance records</Text>
                </View>
                <Pressable style={styles.addFab} onPress={openForm}>
                    <Plus color="#fff" size={18} />
                    <Text style={styles.addFabText}>Add</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    {records.length === 0 ? (
                        <View style={styles.empty}>
                            <Wrench color={theme.textMuted} size={48} />
                            <Text style={styles.emptyTitle}>No service records yet</Text>
                            <Text style={styles.emptySubtitle}>Tap Add to log your first record</Text>
                        </View>
                    ) : (
                        records.map((rec, idx) => (
                            <View
                                key={rec.id}
                                style={[styles.entryRow, idx < records.length - 1 && styles.entryRowBorder]}
                            >
                                <View style={styles.entryIconWrap}>
                                    <Wrench color="#34D399" size={18} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.entryName}>{rec.serviceType}</Text>
                                    <Text style={styles.entrySub}>
                                        {rec.vehicleName} · {rec.date}
                                    </Text>
                                </View>
                                {rec.cost > 0 && (
                                    <Text style={styles.entryAmount}>${rec.cost.toFixed(2)}</Text>
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
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
    },
    title: { fontSize: 28, fontWeight: "700", color: theme.textPrimary },
    subtitle: { color: theme.textMuted, fontSize: 13, marginTop: 2 },
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
        backgroundColor: "#11C767",
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
        backgroundColor: "#34D39922",
        alignItems: "center",
        justifyContent: "center",
    },
    scroll: { padding: 20, gap: 16, paddingBottom: 40 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 20 },
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
    textarea: { minHeight: 96, paddingTop: 12 },
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
        backgroundColor: "#11C767",
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 20,
    },
    addBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    empty: { alignItems: "center", paddingVertical: 32 },
    emptyTitle: { color: theme.textPrimary, fontSize: 16, fontWeight: "600", marginTop: 14 },
    emptySubtitle: { color: theme.textMuted, fontSize: 13, marginTop: 4 },
    entryRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 8 },
    entryRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.borderRow },
    entryName: { color: theme.textPrimary, fontSize: 14, fontWeight: "600" },
    entrySub: { color: theme.textMuted, fontSize: 12, marginTop: 2 },
    entryAmount: { color: "#34D399", fontSize: 15, fontWeight: "700" },
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

import { router } from "expo-router";
import { AlertTriangle, ArrowLeft, Check } from "lucide-react-native";
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
import { useTabBarSpacing } from "../../hooks/use-tab-bar-spacing";
import { useVehicleStore } from "../../context/vehicle-context";

export default function AddScreen() {
    const { addVehicle } = useVehicleStore();
    const tabBarSpacing = useTabBarSpacing();
    const [name, setName] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [plate, setPlate] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const [messageVisible, setMessageVisible] = useState(false);
    const [messageVariant, setMessageVariant] = useState<"success" | "error">("success");
    const [messageTitle, setMessageTitle] = useState("");
    const [messageSubtitle, setMessageSubtitle] = useState("");

    const handleSave = () => {
        const trimmedName = name.trim();
        const trimmedMake = make.trim();
        const trimmedModel = model.trim();
        const trimmedColor = color.trim();
        const trimmedPlate = plate.trim().toUpperCase();
        const parsedYear = Number(year);
        const parsedMileage = Number(mileage);

        if (!trimmedName || !trimmedMake || !trimmedModel || !trimmedPlate) {
            setMessageVariant("error");
            setMessageTitle("Missing details");
            setMessageSubtitle("Please fill all required fields.");
            setMessageVisible(true);
            return;
        }

        if (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
            setMessageVariant("error");
            setMessageTitle("Invalid year");
            setMessageSubtitle("Please enter a valid year, for example 2026.");
            setMessageVisible(true);
            return;
        }

        if (!Number.isFinite(parsedMileage) || parsedMileage < 0) {
            setMessageVariant("error");
            setMessageTitle("Invalid mileage");
            setMessageSubtitle("Please enter a valid mileage.");
            setMessageVisible(true);
            return;
        }

        addVehicle({
            name: trimmedName,
            make: trimmedMake,
            model: trimmedModel,
            plate: trimmedPlate,
            year: parsedYear,
            color: trimmedColor || "Unknown",
            mileage: parsedMileage,
        });

        setName("");
        setMake("");
        setModel("");
        setColor("");
        setPlate("");
        setYear("");
        setMileage("");

        setMessageVariant("success");
        setMessageTitle("Vehicle added");
        setMessageSubtitle("Your vehicle has been saved.");
        setMessageVisible(true);
    };

    return (
        <>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <ScrollView
                        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpacing }]}
                        keyboardShouldPersistTaps="handled">
                        <View style={styles.pageHeader}>
                            <Pressable style={styles.backButton} onPress={() => router.push("/(tabs)/vehicles")}>
                                <ArrowLeft color="#E2E8F0" size={18} />
                            </Pressable>
                            <View>
                                <Text style={styles.title}>Add Vehicle</Text>
                                <Text style={styles.subtitle}>Register a new vehicle</Text>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.label}>Vehicle Name *</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g., My Honda"
                                placeholderTextColor="#8F9BB0"
                                style={styles.input}
                            />

                            <View style={styles.row}>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Make *</Text>
                                    <TextInput
                                        value={make}
                                        onChangeText={setMake}
                                        placeholder="Honda"
                                        placeholderTextColor="#8F9BB0"
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Model *</Text>
                                    <TextInput
                                        value={model}
                                        onChangeText={setModel}
                                        placeholder="Civic"
                                        placeholderTextColor="#8F9BB0"
                                        style={styles.input}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Year</Text>
                                    <TextInput
                                        value={year}
                                        onChangeText={setYear}
                                        placeholder="2026"
                                        placeholderTextColor="#8F9BB0"
                                        keyboardType="number-pad"
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Color</Text>
                                    <TextInput
                                        value={color}
                                        onChangeText={setColor}
                                        placeholder="Blue"
                                        placeholderTextColor="#8F9BB0"
                                        style={styles.input}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>License Plate</Text>
                            <TextInput
                                value={plate}
                                onChangeText={setPlate}
                                placeholder="ABC 1234"
                                placeholderTextColor="#8F9BB0"
                                autoCapitalize="characters"
                                style={styles.input}
                            />

                            <Text style={styles.label}>Current Mileage (km)</Text>
                            <TextInput
                                value={mileage}
                                onChangeText={setMileage}
                                placeholder="0"
                                placeholderTextColor="#8F9BB0"
                                keyboardType="number-pad"
                                style={styles.input}
                            />
                        </View>

                        <Pressable style={styles.saveButton} onPress={handleSave}>
                            <Check color="#F8FAFC" size={20} />
                            <Text style={styles.saveButtonText}>Add Vehicle</Text>
                        </Pressable>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <Modal
                visible={messageVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMessageVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View
                            style={[
                                styles.modalIconWrap,
                                messageVariant === "success" ? styles.successIconWrap : styles.errorIconWrap,
                            ]}>
                            {messageVariant === "success" ? (
                                <Check color="#34D399" size={22} />
                            ) : (
                                <AlertTriangle color="#F87171" size={22} />
                            )}
                        </View>
                        <Text style={styles.modalTitle}>{messageTitle}</Text>
                        <Text style={styles.modalSubtitle}>{messageSubtitle}</Text>

                        <View style={styles.modalButtons}>
                            {messageVariant === "success" ? (
                                <>
                                    <Pressable
                                        style={[styles.modalButton, styles.primaryButton]}
                                        onPress={() => {
                                            setMessageVisible(false);
                                            router.push("/(tabs)/vehicles");
                                        }}>
                                        <Text style={styles.primaryButtonText}>View Vehicles</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.modalButton, styles.secondaryButton]}
                                        onPress={() => setMessageVisible(false)}>
                                        <Text style={styles.secondaryButtonText}>Add Another</Text>
                                    </Pressable>
                                </>
                            ) : (
                                <Pressable
                                    style={[styles.modalButton, styles.secondaryButton]}
                                    onPress={() => setMessageVisible(false)}>
                                    <Text style={styles.secondaryButtonText}>OK</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 10,
    },
    pageHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2A3A56",
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.3)",
    },
    title: {
        color: "#fff",
        fontSize: 38,
        fontWeight: "700",
        lineHeight: 40,
    },
    subtitle: {
        color: "#9CA3AF",
        marginTop: 2,
        fontSize: 16,
        fontWeight: "500",
    },
    card: {
        backgroundColor: "#334155",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.35)",
    },
    label: {
        color: "#D1D5DB",
        marginBottom: 8,
        marginTop: 12,
        fontSize: 16,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.25)",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#F8FAFC",
        fontSize: 17,
        backgroundColor: "#3F4B60",
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    col: {
        flex: 1,
    },
    saveButton: {
        marginTop: 16,
        height: 56,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        backgroundColor: "#4F46E5",
    },
    saveButtonText: {
        color: "#F8FAFC",
        fontSize: 17,
        fontWeight: "700",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.62)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 22,
    },
    modalCard: {
        width: "100%",
        borderRadius: 18,
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.35)",
        padding: 18,
    },
    modalIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        borderWidth: 1,
        marginBottom: 12,
    },
    successIconWrap: {
        backgroundColor: "rgba(52, 211, 153, 0.12)",
        borderColor: "rgba(52, 211, 153, 0.25)",
    },
    errorIconWrap: {
        backgroundColor: "rgba(248, 113, 113, 0.12)",
        borderColor: "rgba(248, 113, 113, 0.25)",
    },
    modalTitle: {
        color: "#F8FAFC",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 4,
    },
    modalSubtitle: {
        color: "#CBD5E1",
        fontSize: 15,
        fontWeight: "500",
        marginBottom: 16,
    },
    modalButtons: {
        gap: 10,
    },
    modalButton: {
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    primaryButton: {
        backgroundColor: "#4F46E5",
        borderColor: "#4F46E5",
    },
    primaryButtonText: {
        color: "#F8FAFC",
        fontWeight: "700",
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: "transparent",
        borderColor: "rgba(148, 163, 184, 0.35)",
    },
    secondaryButtonText: {
        color: "#E2E8F0",
        fontWeight: "700",
        fontSize: 16,
    },
});

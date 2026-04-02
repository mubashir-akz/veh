import { router } from "expo-router";
import { AlertTriangle, ArrowLeft, Check } from "lucide-react-native";
import { useState } from "react";
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

export default function AddVehicleScreen() {
    const { addVehicle } = useVehicleStore();
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
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (isSaving) {
            return;
        }

        const trimmedName = name.trim();
        const trimmedMake = make.trim();
        const trimmedModel = model.trim();
        const trimmedColor = color.trim();
        const trimmedPlate = plate.trim().toUpperCase();
        const trimmedYear = year.trim();
        const trimmedMileage = mileage.trim();
        const parsedYear = trimmedYear ? Number(trimmedYear) : undefined;
        const parsedMileage = trimmedMileage ? Number(trimmedMileage) : undefined;

        if (!trimmedName || !trimmedMake || !trimmedModel || !trimmedPlate) {
            setMessageVariant("error");
            setMessageTitle("Missing details");
            setMessageSubtitle("Please fill all required fields.");
            setMessageVisible(true);
            return;
        }

        if (
            parsedYear !== undefined &&
            (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > 2100)
        ) {
            setMessageVariant("error");
            setMessageTitle("Invalid year");
            setMessageSubtitle("Please enter a valid year, for example 2026.");
            setMessageVisible(true);
            return;
        }

        if (
            parsedMileage !== undefined &&
            (!Number.isFinite(parsedMileage) || parsedMileage < 0)
        ) {
            setMessageVariant("error");
            setMessageTitle("Invalid mileage");
            setMessageSubtitle("Please enter a valid mileage.");
            setMessageVisible(true);
            return;
        }

        try {
            setIsSaving(true);

            await addVehicle({
                name: trimmedName,
                make: trimmedMake,
                model: trimmedModel,
                plate: trimmedPlate,
                ...(parsedYear !== undefined ? { year: parsedYear } : {}),
                ...(trimmedColor ? { color: trimmedColor } : {}),
                ...(parsedMileage !== undefined ? { mileage: parsedMileage } : {}),
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
            setMessageSubtitle("Your vehicle has been saved to the API.");
            setMessageVisible(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to save vehicle right now.";
            setMessageVariant("error");
            setMessageTitle("Save failed");
            setMessageSubtitle(message);
            setMessageVisible(true);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        <View style={styles.pageHeader}>
                            <Pressable style={styles.backButton} onPress={() => router.back()}>
                                <ArrowLeft color="#E2E8F0" size={18} />
                            </Pressable>
                            <View>
                                <Text style={styles.title}>Add Vehicle</Text>
                                <Text style={styles.subtitle}>Register a new vehicle</Text>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Vehicle Details</Text>
                            <Text style={styles.cardSubtitle}>Use the same clean structure as the dashboard cards.</Text>

                            <Text style={styles.label}>Vehicle Name *</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g., My Honda"
                                placeholderTextColor={theme.placeholder}
                                style={styles.input}
                            />

                            <View style={styles.row}>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Make *</Text>
                                    <TextInput
                                        value={make}
                                        onChangeText={setMake}
                                        placeholder="Honda"
                                        placeholderTextColor={theme.placeholder}
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Model *</Text>
                                    <TextInput
                                        value={model}
                                        onChangeText={setModel}
                                        placeholder="Civic"
                                        placeholderTextColor={theme.placeholder}
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
                                        placeholderTextColor={theme.placeholder}
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
                                        placeholderTextColor={theme.placeholder}
                                        style={styles.input}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>License Plate *</Text>
                            <TextInput
                                value={plate}
                                onChangeText={setPlate}
                                placeholder="ABC 1234"
                                placeholderTextColor={theme.placeholder}
                                autoCapitalize="characters"
                                style={styles.input}
                            />

                            <Text style={styles.label}>Current Mileage (km)</Text>
                            <TextInput
                                value={mileage}
                                onChangeText={setMileage}
                                placeholder="0"
                                placeholderTextColor={theme.placeholder}
                                keyboardType="number-pad"
                                style={styles.input}
                            />
                        </View>

                        <Pressable style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={() => void handleSave()} disabled={isSaving}>
                            {isSaving ? (
                                <ActivityIndicator color="#F8FAFC" />
                            ) : (
                                <Check color="#F8FAFC" size={20} />
                            )}
                            <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Add Vehicle"}</Text>
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
                                            router.replace("/(tabs)/vehicles");
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
        backgroundColor: theme.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 32,
    },
    pageHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.surface,
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
    card: {
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 20,
    },
    cardTitle: {
        color: theme.textPrimary,
        fontSize: 18,
        fontWeight: "700",
    },
    cardSubtitle: {
        color: theme.textMuted,
        fontSize: 14,
        marginTop: 4,
        marginBottom: 4,
    },
    label: {
        color: theme.textLabel,
        marginBottom: 8,
        marginTop: 14,
        fontSize: 14,
        fontWeight: "600",
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: theme.textOnDark,
        fontSize: 16,
        backgroundColor: theme.surface,
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
        height: 54,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        backgroundColor: theme.primary,
    },
    saveButtonDisabled: {
        opacity: 0.8,
    },
    saveButtonText: {
        color: theme.primaryText,
        fontSize: 16,
        fontWeight: "700",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: theme.modalOverlay,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 22,
    },
    modalCard: {
        width: "100%",
        borderRadius: 16,
        backgroundColor: theme.card,
        padding: 20,
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
        color: theme.primaryText,
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 4,
    },
    modalSubtitle: {
        color: theme.textMuted,
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
        backgroundColor: theme.primary,
        borderColor: theme.primary,
    },
    primaryButtonText: {
        color: theme.primaryText,
        fontWeight: "700",
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: "transparent",
        borderColor: theme.borderRow,
    },
    secondaryButtonText: {
        color: theme.textOnDark,
        fontWeight: "700",
        fontSize: 16,
    },
});

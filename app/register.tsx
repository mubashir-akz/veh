import { router } from "expo-router";
import { CarFront, Eye, EyeOff, Lock, Mail, User } from "lucide-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
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
import { useAuthStore } from "../context/auth-context";
import { useVehicleStore } from "../context/vehicle-context";

export default function RegisterScreen() {
    const { register } = useAuthStore();
    const { refreshVehicles } = useVehicleStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (loading) return;

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedName) {
            setError("Full name is required.");
            return;
        }
        if (!trimmedEmail) {
            setError("Email is required.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await register(trimmedEmail, password, trimmedName);
            await refreshVehicles();
            router.replace("/(tabs)");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    {/* Logo */}
                    <View style={styles.logoArea}>
                        <View style={styles.logoCircle}>
                            <CarFront color={theme.primaryText} size={38} />
                        </View>
                        <Text style={styles.appName}>Vehicly</Text>
                        <Text style={styles.tagline}>Your personal fleet manager</Text>
                    </View>

                    {/* Form card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Create account</Text>
                        <Text style={styles.cardSubtitle}>Start managing your vehicles today</Text>

                        {error ? (
                            <View style={styles.errorBanner}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputWrap}>
                            <User color={theme.textMuted} size={18} />
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="John Doe"
                                placeholderTextColor={theme.placeholder}
                                autoCapitalize="words"
                                autoComplete="name"
                                style={styles.input}
                            />
                        </View>

                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrap}>
                            <Mail color={theme.textMuted} size={18} />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="you@example.com"
                                placeholderTextColor={theme.placeholder}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                style={styles.input}
                            />
                        </View>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrap}>
                            <Lock color={theme.textMuted} size={18} />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Min. 6 characters"
                                placeholderTextColor={theme.placeholder}
                                secureTextEntry={!showPassword}
                                autoComplete="new-password"
                                style={[styles.input, styles.passwordInput]}
                            />
                            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                                {showPassword ? (
                                    <EyeOff color={theme.textMuted} size={18} />
                                ) : (
                                    <Eye color={theme.textMuted} size={18} />
                                )}
                            </Pressable>
                        </View>

                        <Pressable
                            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                            onPress={() => void handleRegister()}
                            disabled={loading}>
                            {loading ? <ActivityIndicator color={theme.primaryText} size="small" /> : null}
                            <Text style={styles.primaryBtnText}>{loading ? "Creating account…" : "Create Account"}</Text>
                        </Pressable>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Pressable onPress={() => router.push("/login")}>
                            <Text style={styles.footerLink}>Sign in</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    flex: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
        gap: 24,
    },
    logoArea: {
        alignItems: "center",
        gap: 10,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: theme.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    appName: {
        color: theme.textPrimary,
        fontSize: 30,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    tagline: {
        color: theme.textMuted,
        fontSize: 14,
    },
    card: {
        backgroundColor: theme.card,
        borderRadius: 20,
        padding: 22,
    },
    cardTitle: {
        color: theme.textPrimary,
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 4,
    },
    cardSubtitle: {
        color: theme.textMuted,
        fontSize: 14,
        marginBottom: 12,
    },
    errorBanner: {
        backgroundColor: "rgba(248,113,113,0.12)",
        borderWidth: 1,
        borderColor: "rgba(248,113,113,0.24)",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
    },
    errorText: {
        color: "#F87171",
        fontSize: 14,
        fontWeight: "500",
    },
    label: {
        color: theme.textLabel,
        fontSize: 13,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 6,
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
    },
    input: {
        flex: 1,
        color: theme.textOnDark,
        fontSize: 16,
    },
    passwordInput: {
        flex: 1,
    },
    primaryBtn: {
        marginTop: 20,
        height: 52,
        borderRadius: 16,
        backgroundColor: theme.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    primaryBtnDisabled: {
        opacity: 0.75,
    },
    primaryBtnText: {
        color: theme.primaryText,
        fontSize: 16,
        fontWeight: "700",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    footerText: {
        color: theme.textMuted,
        fontSize: 14,
    },
    footerLink: {
        color: theme.primary,
        fontSize: 14,
        fontWeight: "700",
    },
});

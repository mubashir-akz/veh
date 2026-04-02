import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { authAPI, tokenStorage } from "./services/api";
import { theme } from "../constants/theme";

export default function SignupScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.register({ email, password, name });
            const { access_token, user } = response;
            await tokenStorage.setToken(access_token, user);
            router.replace("/(tabs)/vehicles");
        } catch (error: any) {
            Alert.alert("Signup Failed", error.message || "Could not create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start tracking your vehicles</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={theme.placeholder}
                                style={styles.input}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor={theme.placeholder}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Create a password"
                                placeholderTextColor={theme.placeholder}
                                style={styles.input}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm your password"
                                placeholderTextColor={theme.placeholder}
                                style={styles.input}
                                secureTextEntry
                            />
                        </View>

                        <Pressable
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={loading}>
                            <Text style={styles.buttonText}>
                                {loading ? "Creating account..." : "Create Account"}
                            </Text>
                        </Pressable>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <Pressable onPress={() => router.back()}>
                                <Text style={styles.link}> Sign In</Text>
                            </Pressable>
                        </View>
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
    keyboardView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: theme.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
    },
    form: {
        width: "100%",
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: theme.text,
        borderWidth: 1,
        borderColor: theme.border,
    },
    button: {
        backgroundColor: theme.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        color: theme.textSecondary,
        fontSize: 14,
    },
    link: {
        color: theme.primary,
        fontSize: 14,
        fontWeight: "600",
    },
});
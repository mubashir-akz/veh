import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../constants/theme';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Get Started</Text>
            <Text style={styles.subtitle}>Create your Fleet Flow account</Text>

            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.textMuted}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
            </Pressable>

            <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
            </View>

            <View style={styles.socialRow}>
                <Pressable style={styles.socialBtn}><Ionicons name="logo-google" size={24} color={theme.textMuted} /></Pressable>
                <Pressable style={styles.socialBtn}><FontAwesome name="facebook" size={24} color={theme.textMuted} /></Pressable>
                <Pressable style={styles.socialBtn}><Ionicons name="logo-apple" size={24} color={theme.textMuted} /></Pressable>
            </View>

            <Text style={styles.footerText}>
                Already have an account? <Text style={styles.link}>Login</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151E2E',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: 8,
        marginTop: 12,
    },
    subtitle: {
        color: '#94A3B8',
        fontSize: 16,
        marginBottom: 32,
    },
    label: {
        color: '#CBD5E1',
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#232F47',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 18,
        width: '100%',
        height: 52,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: '#F1F5F9',
        fontSize: 16,
        height: 52,
    },
    button: {
        backgroundColor: '#A21CF5',
        borderRadius: 14,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 24,
        marginTop: 4,
        shadowColor: '#A21CF5',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
    },
    orRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
        width: '100%',
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#23304A',
        opacity: 0.5,
    },
    orText: {
        color: '#64748B',
        marginHorizontal: 12,
        fontWeight: '600',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
        gap: 18,
    },
    socialBtn: {
        flex: 1,
        backgroundColor: '#232F47',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#334155',
    },
    footerText: {
        color: '#94A3B8',
        marginTop: 8,
        fontSize: 15,
    },
    link: {
        color: '#38BDF8',
        fontWeight: '700',
    },
});
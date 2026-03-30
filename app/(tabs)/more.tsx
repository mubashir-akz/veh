import { router } from "expo-router";
import {
    Bell,
    ChevronRight,
    Fuel,
    HandCoins,
    Info,
    LogIn,
    Settings,
    Wrench,
    type LucideIcon,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TabScreen } from "../../components/ui/tab-screen";
import { theme } from "../../constants/theme";
import { useTabBarSpacing } from "../../hooks/use-tab-bar-spacing";

type MenuItem = {
    key: string;
    title: string;
    subtitle: string;
    iconBg: string;
    icon: LucideIcon;
    onPress: () => void;
};

export default function MoreScreen() {
    const tabBarSpacing = useTabBarSpacing(0);

    const features: MenuItem[] = [
        {
            key: "fuel",
            title: "Fuel Log",
            subtitle: "0 entries",
            iconBg: "#2F7AF8",
            icon: Fuel,
            onPress: () => router.push("/fuel-log"),
        },
        {
            key: "service",
            title: "Service History",
            subtitle: "0 records",
            iconBg: "#11C767",
            icon: Wrench,
            onPress: () => router.push("/service-history"),
        },
        {
            key: "expense",
            title: "Expenses",
            subtitle: "0 expenses",
            iconBg: "#FF7A00",
            icon: HandCoins,
            onPress: () => router.push("/expenses"),
        },
        {
            key: "reminder",
            title: "Reminders",
            subtitle: "0 active",
            iconBg: "#9333EA",
            icon: Bell,
            onPress: () => { },
        },
    ];

    const account: MenuItem[] = [
        {
            key: "login",
            title: "Login",
            subtitle: "Sign in to your account",
            iconBg: "#2F7AF8",
            icon: LogIn,
            onPress: () => { },
        },
        {
            key: "settings",
            title: "Settings",
            subtitle: "Preferences & options",
            iconBg: "#475569",
            icon: Settings,
            onPress: () => { },
        },
        {
            key: "about",
            title: "About",
            subtitle: "App version & info",
            iconBg: "#475569",
            icon: Info,
            onPress: () => { },
        },
    ];

    return (
        <TabScreen style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scroll, { paddingBottom: tabBarSpacing }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>More</Text>
                <Text style={styles.subtitle}>Additional features & settings</Text>

                <Text style={styles.sectionLabel}>FEATURES</Text>
                <View style={styles.section}>
                    {features.map((item, i) => (
                        <MenuRow key={item.key} item={item} last={i === features.length - 1} />
                    ))}
                </View>

                <Text style={styles.sectionLabel}>ACCOUNT</Text>
                <View style={styles.section}>
                    {account.map((item, i) => (
                        <MenuRow key={item.key} item={item} last={i === account.length - 1} />
                    ))}
                </View>
            </ScrollView>
        </TabScreen>
    );
}

function MenuRow({ item, last }: { item: MenuItem; last: boolean }) {
    const Icon = item.icon;
    return (
        <Pressable
            style={({ pressed }) => [styles.row, !last && styles.rowBorder, pressed && styles.rowPressed]}
            onPress={item.onPress}
        >
            <View style={[styles.rowIcon, { backgroundColor: item.iconBg }]}>
                <Icon color="#fff" size={20} />
            </View>
            <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
            </View>
            <ChevronRight color={theme.textMuted} size={18} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollView: { backgroundColor: theme.background },
    scroll: { padding: 20 },
    title: { fontSize: 28, fontWeight: "700", color: theme.textPrimary },
    subtitle: { color: theme.textMuted, fontSize: 14, marginBottom: 24 },
    sectionLabel: {
        color: theme.textMuted,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.2,
        marginBottom: 8,
        marginTop: 4,
    },
    section: {
        backgroundColor: theme.card,
        borderRadius: 16,
        marginBottom: 20,
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 14,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.borderRow,
    },
    rowPressed: { opacity: 0.75 },
    rowIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    rowText: { flex: 1 },
    rowTitle: { color: theme.textPrimary, fontSize: 16, fontWeight: "600" },
    rowSubtitle: { color: theme.textMuted, fontSize: 13, marginTop: 1 },
});

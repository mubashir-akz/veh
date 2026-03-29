import { Menu } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreScreen() {
    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <Text style={styles.title}>More</Text>
            <View style={styles.card}>
                <Menu color="#94A3B8" size={28} />
                <Text style={styles.text}>More options coming soon</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
        padding: 20,
        paddingBottom: 150,
    },
    title: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    text: {
        color: "#CBD5E1",
        fontSize: 16,
    },
});

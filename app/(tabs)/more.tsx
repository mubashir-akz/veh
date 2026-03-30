import { Menu } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { TabScreen } from "../../components/ui/tab-screen";

export default function MoreScreen() {
    return (
        <TabScreen style={styles.container}>
            <Text style={styles.title}>More</Text>
            <View style={styles.card}>
                <Menu color="#94A3B8" size={28} />
                <Text style={styles.text}>More options coming soon</Text>
            </View>
        </TabScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
        padding: 20,
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

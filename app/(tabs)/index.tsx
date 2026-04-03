import { Bell, Car } from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { G, Rect, Svg, Text as SvgText } from 'react-native-svg';
import { TabScreen } from '../../components/ui/tab-screen';
import { theme } from '../../constants/theme';
import { useTabBarSpacing } from '../../hooks/use-tab-bar-spacing';
import { useVehicleStore } from '../../context/vehicle-context';

type Filter = 'all' | 'fuel' | 'service' | 'other';

const FILTER_COLORS: Record<Filter, string> = {
  all:     '#60A5FA',
  fuel:    '#F97316',
  service: '#A78BFA',
  other:   '#34D399',
};

function formatLabel(val: number): string {
  if (val <= 0) return '';
  return val >= 1000 ? '$' + (val / 1000).toFixed(1) + 'k' : '$' + val;
}

function SpendingChart({ filter, trend }: { filter: Filter; trend: { months: string[]; fuel: number[]; service: number[]; other: number[] } | null }) {
  const months = trend?.months ?? [];
  const getData = () => {
    if (!trend) return [];
    if (filter === 'fuel')    return trend.fuel;
    if (filter === 'service') return trend.service;
    if (filter === 'other')   return trend.other;
    return months.map((_, i) => trend.fuel[i] + trend.service[i] + trend.other[i]);
  };
  const data   = getData();
  const maxVal = Math.max(...data, 1);
  const W      = 320;
  const barMaxH = 90;
  const barW   = 34;
  const totalH = 148;
  const gap    = (W - barW * months.length) / (months.length + 1);
  const color  = FILTER_COLORS[filter];

  if (!trend || months.length === 0) {
    return (
      <View style={{ height: 148, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.textMuted, fontSize: 13 }}>No spending data yet</Text>
      </View>
    );
  }

  return (
    <Svg width="100%" height={totalH} viewBox={`0 0 ${W} ${totalH}`}>
      {months.map((month, i) => {
        const barH   = data[i] > 0 ? Math.max((data[i] / maxVal) * barMaxH, 4) : 0;
        const x      = gap + i * (barW + gap);
        const barTop = 28 + barMaxH - barH;
        const label  = formatLabel(data[i]);
        return (
          <G key={month}>
            {label ? (
              <SvgText
                x={x + barW / 2}
                y={barTop - 4}
                textAnchor="middle"
                fontSize={10}
                fontWeight="600"
                fill={color}>
                {label}
              </SvgText>
            ) : null}
            <Rect x={x} y={barTop} width={barW} height={barH || 0.01} rx={6} fill={color} opacity={0.85} />
            <SvgText x={x + barW / 2} y={totalH - 4} textAnchor="middle" fontSize={11} fill="#94A3B8">
              {month}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

export default function DashboardScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const { vehicles, dashboardTrend, loadDashboardTrend } = useVehicleStore();
  const tabBarSpacing = useTabBarSpacing(0);

  // Load trend for first vehicle
  useEffect(() => {
    if (vehicles.length > 0) {
      void loadDashboardTrend(vehicles[0].id, 6);
    }
  }, [vehicles, loadDashboardTrend]);

  const getTotals = () => {
    if (!dashboardTrend) return { fuel: 0, service: 0, other: 0, total: 0 };
    const fuel    = dashboardTrend.fuel.reduce((a, b) => a + b, 0);
    const service = dashboardTrend.service.reduce((a, b) => a + b, 0);
    const other   = dashboardTrend.other.reduce((a, b) => a + b, 0);
    return { fuel, service, other, total: fuel + service + other };
  };
  const totals = getTotals();

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',     label: 'All'     },
    { key: 'fuel',    label: 'Fuel'    },
    { key: 'service', label: 'Service' },
    { key: 'other',   label: 'Other'   },
  ];

  return (
    <TabScreen style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { flexGrow: 1, paddingBottom: tabBarSpacing }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Fleet Flow</Text>
        <Text style={styles.subtitle}>Track your vehicles and expenses</Text>

        <View style={styles.row}>
          <Card icon={<Car color="#60A5FA" />} title="Vehicles" value={vehicles.length.toString()} />
          <Card icon={<Bell color="#FACC15" />} title="Reminders" value="0" />
        </View>

        <View style={styles.bigCard}>
          <Text style={styles.label}>Monthly Spending</Text>

          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[
                  styles.filterBtn,
                  filter === f.key && {
                    backgroundColor: FILTER_COLORS[f.key] + '28',
                    borderColor: FILTER_COLORS[f.key],
                  },
                ]}>
                <Text style={[styles.filterText, filter === f.key && { color: FILTER_COLORS[f.key] }]}>
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <SpendingChart filter={filter} trend={dashboardTrend} />

          <View style={styles.spendingRow}>
            <Text style={styles.spendingLabel}>Fuel</Text>
            <Text style={[styles.spendingValue, { color: FILTER_COLORS.fuel }]}>${totals.fuel.toFixed(2)}</Text>
          </View>
          <View style={styles.spendingRow}>
            <Text style={styles.spendingLabel}>Service</Text>
            <Text style={[styles.spendingValue, { color: FILTER_COLORS.service }]}>${totals.service.toFixed(2)}</Text>
          </View>
          <View style={styles.spendingRow}>
            <Text style={styles.spendingLabel}>Other</Text>
            <Text style={[styles.spendingValue, { color: FILTER_COLORS.other }]}>${totals.other.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totals.total.toFixed(2)}</Text>
          </View>
        </View>

        {vehicles.length === 0 && (
          <View style={styles.emptyCard}>
            <Car size={40} color="#94A3B8" />
            <Text style={styles.emptyText}>No vehicles added yet</Text>
            <Text style={styles.emptySub}>Tap the + button to add your first vehicle</Text>
          </View>
        )}
      </ScrollView>
    </TabScreen>
  );
}

type CardProps = { icon: ReactNode; title: string; value: string };
function Card({ icon, title, value }: CardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>{icon}</View>
      <View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.cardText}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollView: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 20, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: theme.textPrimary },
  subtitle: { color: theme.textMuted, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 10 },
  card: { flex: 1, backgroundColor: theme.card, padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: { backgroundColor: theme.surface, padding: 10, borderRadius: 12 },
  value: { color: '#fff', fontSize: 20, fontWeight: '600' },
  cardText: { color: theme.textMuted },
  bigCard: { marginTop: 15, backgroundColor: theme.card, borderRadius: 16, padding: 20 },
  label: { color: '#FDE68A', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterBtn: { flex: 1, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: theme.borderSoft, alignItems: 'center' },
  filterText: { color: theme.textMuted, fontSize: 12, fontWeight: '600' },
  spendingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.borderRow },
  spendingLabel: { color: '#E2E8F0', fontSize: 16 },
  spendingValue: { fontSize: 16, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  totalLabel: { color: theme.textOnDark, fontSize: 18, fontWeight: '700' },
  totalValue: { color: theme.textOnDark, fontSize: 18, fontWeight: '700' },
  emptyCard: { marginTop: 20, backgroundColor: theme.card, borderRadius: 16, padding: 30, alignItems: 'center', marginBottom: 20 },
  emptyText: { color: theme.textPrimary, marginTop: 10, fontSize: 16 },
  emptySub: { color: theme.textMuted, marginTop: 5, textAlign: 'center' },
});

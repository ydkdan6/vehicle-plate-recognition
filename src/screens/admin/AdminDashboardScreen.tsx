import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { useVehicleStore } from '../../stores/vehicleStore';
import { AdminStackParamList } from '../../navigation/AppNavigator';
import { Car, User, ShieldCheck, ChevronRight } from '../../components/Icons';

type AdminDashboardNavigationProp = NativeStackNavigationProp<AdminStackParamList>;

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      {icon}
    </View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

const AdminDashboardScreen = () => {
  const navigation = useNavigation<AdminDashboardNavigationProp>();
  const { user } = useAuthStore();
  const { vehicles, fetchAllVehicles, loading, getPendingVehicles, getStatistics } = useVehicleStore();
  
  useEffect(() => {
    fetchAllVehicles();
  }, []);
  
  const stats = getStatistics();
  const pendingVehicles = getPendingVehicles();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome, Admin
        </Text>
        <Text style={styles.subgreeting}>
          Dashboard Overview
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsContainer}>
          <StatCard 
            title="Total Vehicles" 
            value={stats.total} 
            icon={<Car size={24} color={COLORS.primary[500]} />}
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={<ShieldCheck size={24} color={COLORS.warning} />}
          />
          <StatCard 
            title="Users" 
            value={1} // Demo value
            icon={<User size={24} color={COLORS.accent[500]} />}
          />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AdminTabs', { screen: 'Verification' })}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        {pendingVehicles.length > 0 ? (
          pendingVehicles.map((vehicle) => (
            <TouchableOpacity 
              key={vehicle.id}
              style={styles.vehicleCard}
              onPress={() => navigation.navigate('VerifyPlate', { vehicleId: vehicle.id })}
            >
              <View style={styles.vehicleInfo}>
                <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
                <Text style={styles.vehicleModel}>{vehicle.make} {vehicle.model}</Text>
                <Text style={styles.vehicleDetails}>
                  {vehicle.year} • {vehicle.color}
                </Text>
              </View>
              <ChevronRight size={20} color={COLORS.secondary[500]} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No pending vehicles to approve</Text>
          </View>
        )}
        
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminTabs', { screen: 'Verification' })}
          >
            <View style={styles.actionIconContainer}>
              <ShieldCheck size={24} color={COLORS.white} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Verify Vehicles</Text>
              <Text style={styles.actionDescription}>Approve or reject vehicle registrations</Text>
            </View>
            <ChevronRight size={20} color={COLORS.secondary[500]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminTabs', { screen: 'Users' })}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: COLORS.accent[500] }]}>
              <User size={24} color={COLORS.white} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Manage Users</Text>
              <Text style={styles.actionDescription}>View and manage user accounts</Text>
            </View>
            <ChevronRight size={20} color={COLORS.secondary[500]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminTabs', { screen: 'Analytics' })}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: COLORS.secondary[700] }]}>
              <Car size={24} color={COLORS.white} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>View Analytics</Text>
              <Text style={styles.actionDescription}>Review vehicle inspection statistics</Text>
            </View>
            <ChevronRight size={20} color={COLORS.secondary[500]} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    paddingHorizontal: SIZES.padding.xl,
    paddingVertical: SIZES.padding.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  greeting: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
  },
  subgreeting: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
    marginTop: SIZES.margin.xs,
  },
  scrollContent: {
    padding: SIZES.padding.lg,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.margin.xl,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    width: '31%',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statIconContainer: {
    backgroundColor: COLORS.background.secondary,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.margin.sm,
  },
  statValue: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  statTitle: {
    fontSize: FONT.size.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin.md,
  },
  sectionTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.primary,
  },
  seeAllText: {
    fontSize: FONT.size.sm,
    color: COLORS.primary[500],
    fontWeight: FONT.weight.medium,
  },
  vehicleCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.lg,
    marginBottom: SIZES.margin.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.xs,
  },
  vehicleModel: {
    fontSize: FONT.size.md,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  vehicleDetails: {
    fontSize: FONT.size.sm,
    color: COLORS.text.secondary,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.margin.xl,
    ...SHADOWS.small,
  },
  emptyStateText: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
  },
  quickActionsContainer: {
    marginTop: SIZES.margin.xl,
  },
  quickActionsTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.md,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.lg,
    marginBottom: SIZES.margin.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.margin.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: FONT.size.sm,
    color: COLORS.text.secondary,
  },
});

export default AdminDashboardScreen;
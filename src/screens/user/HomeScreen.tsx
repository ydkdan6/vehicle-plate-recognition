import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { useVehicleStore, Vehicle } from '../../stores/vehicleStore';
import { UserStackParamList } from '../../navigation/AppNavigator';
import { Car, ChevronRight } from '../../components/Icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<UserStackParamList>;

const VehicleStatusBadge = ({ status }: { status: Vehicle['status'] }) => {
  let backgroundColor;
  let textColor;
  let label;
  
  switch (status) {
    case 'approved':
      backgroundColor = COLORS.accent[100];
      textColor = COLORS.accent[700];
      label = 'Approved';
      break;
    case 'rejected':
      backgroundColor = '#FEECEB';
      textColor = COLORS.error;
      label = 'Rejected';
      break;
    case 'pending':
    default:
      backgroundColor = '#FFF8E6';
      textColor = COLORS.warning;
      label = 'Pending';
      break;
  }
  
  return (
    <View style={[styles.badgeContainer, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthStore();
  const { vehicles, loading, fetchUserVehicles } = useVehicleStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchUserVehicles(user.id);
    }
  }, [user]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchUserVehicles(user.id);
    }
    setRefreshing(false);
  };
  
  const handleVehiclePress = (vehicleId: string) => {
    navigation.navigate('VehicleDetail', { vehicleId });
  };
  
  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => handleVehiclePress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.vehicleImageContainer}>
        <Image 
          source={{ uri: item.imageUrl || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800' }} 
          style={styles.vehicleImage} 
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleHeader}>
          <Text style={styles.plateNumber}>{item.plateNumber}</Text>
          <VehicleStatusBadge status={item.status} />
        </View>
        
        <Text style={styles.vehicleModel}>{item.make} {item.model}</Text>
        <Text style={styles.vehicleDetails}>
          {item.year} • {item.color}
        </Text>
        
        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <ChevronRight size={16} color={COLORS.primary[500]} />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Car size={60} color={COLORS.secondary[300]} />
      <Text style={styles.emptyStateTitle}>No Vehicles Yet</Text>
      <Text style={styles.emptyStateDescription}>
        Add your first vehicle by tapping the "Add Vehicle" tab below
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.fullName?.split(' ')[0]}
        </Text>
        <Text style={styles.subgreeting}>
          Manage your vehicles
        </Text>
      </View>
      
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={renderVehicleItem}
        contentContainerStyle={styles.vehicleList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
  vehicleList: {
    padding: SIZES.padding.lg,
    paddingBottom: 100,
  },
  vehicleCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    marginBottom: SIZES.margin.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  vehicleImageContainer: {
    height: 160,
    width: '100%',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleInfo: {
    padding: SIZES.padding.lg,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin.md,
  },
  plateNumber: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
  },
  badgeContainer: {
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.xs,
    borderRadius: SIZES.radius.sm,
  },
  badgeText: {
    fontSize: FONT.size.xs,
    fontWeight: FONT.weight.semibold,
  },
  vehicleModel: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.medium,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.xs,
  },
  vehicleDetails: {
    fontSize: FONT.size.sm,
    color: COLORS.text.secondary,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.margin.md,
  },
  viewDetailsText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
    color: COLORS.primary[500],
    marginRight: SIZES.margin.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding.xl,
    marginTop: SIZES.margin.xl * 2,
  },
  emptyStateTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.primary,
    marginTop: SIZES.margin.lg,
    marginBottom: SIZES.margin.sm,
  },
  emptyStateDescription: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;
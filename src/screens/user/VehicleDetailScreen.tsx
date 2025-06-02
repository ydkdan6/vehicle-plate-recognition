import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { useVehicleStore, Vehicle } from '../../stores/vehicleStore';
import { UserStackParamList } from '../../navigation/AppNavigator';
import { ChevronRight, Car } from '../../components/Icons';
import { format, parseISO } from 'date-fns';

type VehicleDetailRouteProp = RouteProp<UserStackParamList, 'VehicleDetail'>;
type VehicleDetailNavigationProp = NativeStackNavigationProp<UserStackParamList>;

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

const VehicleDetailScreen = () => {
  const route = useRoute<VehicleDetailRouteProp>();
  const navigation = useNavigation<VehicleDetailNavigationProp>();
  const { vehicleId } = route.params;
  const { getVehicleById } = useVehicleStore();
  const [vehicle, setVehicle] = useState<Vehicle | undefined>(undefined);
  
  useEffect(() => {
    // Get vehicle details
    setVehicle(getVehicleById(vehicleId));
  }, [vehicleId]);
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle Details</Text>
          <View style={{ width: 50 }} />
        </View>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading vehicle details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.vehicleImageContainer}>
          <Image 
            source={{ uri: vehicle.imageUrl || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800' }} 
            style={styles.vehicleImage} 
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.vehicleDetailsCard}>
          <View style={styles.plateNumberContainer}>
            <Text style={styles.plateNumberLabel}>License Plate</Text>
            <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status</Text>
            <VehicleStatusBadge status={vehicle.status} />
          </View>
          
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Make</Text>
              <Text style={styles.detailValue}>{vehicle.make}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Model</Text>
              <Text style={styles.detailValue}>{vehicle.model}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Year</Text>
              <Text style={styles.detailValue}>{vehicle.year}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Color</Text>
              <Text style={styles.detailValue}>{vehicle.color}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>VIN</Text>
              <Text style={styles.detailValue}>{vehicle.vin}</Text>
            </View>
          </View>
          
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Inspection Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Registration Date</Text>
              <Text style={styles.detailValue}>
                {format(parseISO(vehicle.registrationDate), 'MMM dd, yyyy')}
              </Text>
            </View>
            
            {vehicle.verificationDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Verification Date</Text>
                <Text style={styles.detailValue}>
                  {format(parseISO(vehicle.verificationDate), 'MMM dd, yyyy')}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text 
                style={[
                  styles.detailValue, 
                  vehicle.status === 'approved' ? { color: COLORS.accent[700] } : 
                  vehicle.status === 'rejected' ? { color: COLORS.error } :
                  { color: COLORS.warning }
                ]}
              >
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </Text>
            </View>
          </View>
          
          {vehicle.status === 'pending' && (
            <View style={styles.pendingNotice}>
              <Text style={styles.pendingNoticeText}>
                Your vehicle is currently under review by an administrator.
                You will be notified once the inspection is complete.
              </Text>
            </View>
          )}
          
          {vehicle.status === 'rejected' && (
            <View style={styles.rejectedNotice}>
              <Text style={styles.rejectedNoticeText}>
                Your vehicle registration has been rejected.
                Please contact support for more information.
              </Text>
            </View>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding.lg,
    paddingVertical: SIZES.padding.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backButton: {
    padding: SIZES.padding.sm,
  },
  backButtonText: {
    color: COLORS.primary[500],
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.medium,
  },
  headerTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
  },
  vehicleImageContainer: {
    height: 200,
    width: '100%',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleDetailsCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    marginTop: -20,
    paddingHorizontal: SIZES.padding.xl,
    paddingTop: SIZES.padding.xl,
    paddingBottom: SIZES.padding.xl,
    ...SHADOWS.medium,
  },
  plateNumberContainer: {
    marginBottom: SIZES.margin.lg,
  },
  plateNumberLabel: {
    fontSize: FONT.size.sm,
    color: COLORS.text.tertiary,
    marginBottom: SIZES.margin.xs,
  },
  plateNumber: {
    fontSize: FONT.size.xxl,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
  },
  statusContainer: {
    marginBottom: SIZES.margin.xl,
  },
  statusLabel: {
    fontSize: FONT.size.sm,
    color: COLORS.text.tertiary,
    marginBottom: SIZES.margin.xs,
  },
  badgeContainer: {
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.xs,
    borderRadius: SIZES.radius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
  },
  detailsSection: {
    marginBottom: SIZES.margin.xl,
  },
  sectionTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.secondary,
  },
  detailLabel: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
  },
  detailValue: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.medium,
    color: COLORS.text.primary,
  },
  pendingNotice: {
    backgroundColor: '#FFF8E6',
    padding: SIZES.padding.lg,
    borderRadius: SIZES.radius.md,
    marginTop: SIZES.margin.md,
  },
  pendingNoticeText: {
    fontSize: FONT.size.sm,
    color: COLORS.warning,
    lineHeight: 20,
  },
  rejectedNotice: {
    backgroundColor: '#FEECEB',
    padding: SIZES.padding.lg,
    borderRadius: SIZES.radius.md,
    marginTop: SIZES.margin.md,
  },
  rejectedNoticeText: {
    fontSize: FONT.size.sm,
    color: COLORS.error,
    lineHeight: 20,
  },
});

export default VehicleDetailScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { useVehicleStore } from '../../stores/vehicleStore';
import { AdminStackParamList } from '../../navigation/AppNavigator';
// import { 
//   Car, 
//   User, 
//   Calendar, 
//   Palette, 
//   CheckCircle, 
//   XCircle, 
//   ArrowLeft,
//   FileText,
//   Shield
// } from '../../components/Icons';

type VerifyPlateRouteProp = RouteProp<AdminStackParamList, 'VerifyPlate'>;
type VerifyPlateNavigationProp = NativeStackNavigationProp<AdminStackParamList>;

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  owner: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  inspectionHistory?: any[];
}

const InfoRow = ({ 
  icon, 
  label, 
  value, 
  iconColor = COLORS.primary[500] 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  iconColor?: string;
}) => (
  <View style={styles.infoRow}>
    <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
      {React.cloneElement(icon as React.ReactElement, { 
        size: 20, 
        color: iconColor 
      })}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const VerifyPlateScreen = () => {
  const navigation = useNavigation<VerifyPlateNavigationProp>();
  const route = useRoute<VerifyPlateRouteProp>();
  const { vehicleId } = route.params;
  
  const { vehicles, approveVehicle, rejectVehicle, loading } = useVehicleStore();
  const [processing, setProcessing] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    // Find the vehicle by ID
    const foundVehicle = vehicles.find(v => v.id === vehicleId);
    if (foundVehicle) {
      setVehicle(foundVehicle);
    }
  }, [vehicleId, vehicles]);

  const handleApprove = async () => {
    if (!vehicle) return;
    
    Alert.alert(
      'Approve Vehicle',
      `Are you sure you want to approve the vehicle with plate number ${vehicle.plateNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setProcessing(true);
            try {
              await approveVehicle(vehicle.id);
              Alert.alert(
                'Success',
                'Vehicle has been approved successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to approve vehicle. Please try again.');
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!vehicle) return;
    
    Alert.alert(
      'Reject Vehicle',
      `Are you sure you want to reject the vehicle with plate number ${vehicle.plateNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setProcessing(true);
            try {
              await rejectVehicle(vehicle.id);
              Alert.alert(
                'Vehicle Rejected',
                'Vehicle registration has been rejected.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to reject vehicle. Please try again.');
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
          <Text style={styles.loadingText}>Loading vehicle details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {/* <ArrowLeft size={24} color={COLORS.text.primary} /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Vehicle</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.plateContainer}>
          <View style={styles.plateNumberCard}>
            <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
            <View style={[
              styles.statusBadge,
              vehicle.status === 'pending' && styles.pendingBadge,
              vehicle.status === 'approved' && styles.approvedBadge,
              vehicle.status === 'rejected' && styles.rejectedBadge,
            ]}>
              <Text style={[
                styles.statusText,
                vehicle.status === 'pending' && styles.pendingText,
                vehicle.status === 'approved' && styles.approvedText,
                vehicle.status === 'rejected' && styles.rejectedText,
              ]}>
                {vehicle.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          
          {/* <View style={styles.infoContainer}>
            <InfoRow
            //   icon={<Car />}
              label="Make & Model"
              value={`${vehicle.make} ${vehicle.model}`}
            />
            <InfoRow
            //   icon={<Calendar />}
              label="Year"
              value={vehicle.year.toString()}
              iconColor={COLORS.accent[500]}
            />
            <InfoRow
            //   icon={<Palette />}
              label="Color"
              value={vehicle.color}
              iconColor={COLORS.secondary[500]}
            />
            <InfoRow
            //   icon={<User />}
              label="Owner"
              value={vehicle.owner}
              iconColor={COLORS.warning}
            />
            <InfoRow
            //   icon={<FileText />}
              label="Registration Date"
              value={new Date(vehicle.registrationDate).toLocaleDateString()}
              iconColor={COLORS.text.secondary}
            />
          </View> */}
        </View>

        {vehicle.documents && vehicle.documents.length > 0 && (
          <View style={styles.documentsContainer}>
            <Text style={styles.sectionTitle}>Documents</Text>
            <View style={styles.documentsGrid}>
              {vehicle.documents.map((doc, index) => (
                <TouchableOpacity key={index} style={styles.documentCard}>
                  {/* <FileText size={24} color={COLORS.primary[500]} /> */}
                  <Text style={styles.documentText}>Document {index + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.verificationContainer}>
          <Text style={styles.sectionTitle}>Verification Notes</Text>
          <View style={styles.noteCard}>
            {/* <Shield size={24} color={COLORS.primary[500]} /> */}
            <Text style={styles.noteText}>
              Please review all vehicle details and documents before making a decision. 
              Ensure the plate number matches the vehicle registration documents.
            </Text>
          </View>
        </View>
      </ScrollView>

      {vehicle.status === 'pending' && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={handleReject}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                {/* <XCircle size={20} color={COLORS.white} /> */}
                <Text style={styles.rejectButtonText}>Reject</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={handleApprove}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                {/* <CheckCircle size={20} color={COLORS.white} /> */}
                <Text style={styles.approveButtonText}>Approve</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    padding: SIZES.padding.xs,
  },
  headerTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.primary,
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
    marginTop: SIZES.margin.md,
  },
  scrollContent: {
    padding: SIZES.padding.lg,
    paddingBottom: 120,
  },
  plateContainer: {
    marginBottom: SIZES.margin.xl,
  },
  plateNumberCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.padding.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  plateNumber: {
    fontSize: FONT.size.xxl,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.md,
    letterSpacing: 2,
  },
  statusBadge: {
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.xs,
    borderRadius: SIZES.radius.full,
  },
  pendingBadge: {
    backgroundColor: COLORS.warning + '20',
  },
  approvedBadge: {
    backgroundColor: COLORS.success + '20',
  },
  rejectedBadge: {
    backgroundColor: COLORS.error + '20',
  },
  statusText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
  },
  pendingText: {
    color: COLORS.warning,
  },
  approvedText: {
    color: COLORS.success,
  },
  rejectedText: {
    color: COLORS.error,
  },
  detailsContainer: {
    marginBottom: SIZES.margin.xl,
  },
  sectionTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.md,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.lg,
    ...SHADOWS.small,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.margin.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT.size.sm,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.medium,
    color: COLORS.text.primary,
  },
  documentsContainer: {
    marginBottom: SIZES.margin.xl,
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.margin.md,
  },
  documentCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    alignItems: 'center',
    width: '48%',
    ...SHADOWS.small,
  },
  documentText: {
    fontSize: FONT.size.sm,
    color: COLORS.text.secondary,
    marginTop: SIZES.margin.xs,
  },
  verificationContainer: {
    marginBottom: SIZES.margin.xl,
  },
  noteCard: {
    backgroundColor: COLORS.primary[50],
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteText: {
    fontSize: FONT.size.sm,
    color: COLORS.text.secondary,
    marginLeft: SIZES.margin.md,
    flex: 1,
    lineHeight: 20,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding.lg,
    paddingVertical: SIZES.padding.md,
    paddingBottom: SIZES.padding.xl,
    flexDirection: 'row',
    gap: SIZES.margin.md,
    ...SHADOWS.large,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding.md,
    borderRadius: SIZES.radius.md,
    gap: SIZES.margin.xs,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  rejectButtonText: {
    color: COLORS.white,
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
  },
  approveButtonText: {
    color: COLORS.white,
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
  },
});

export default VerifyPlateScreen;
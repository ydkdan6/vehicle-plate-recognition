import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { useVehicleStore } from '../../stores/vehicleStore';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Camera, Car } from '../../components/Icons';

const AddVehicleScreen = () => {
  const { user } = useAuthStore();
  const { addVehicle, loading, error } = useVehicleStore();
  
  const [plateNumber, setPlateNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [vin, setVin] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');
  
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a photo');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async () => {
    // Basic validation
    if (!plateNumber || !make || !model || !year || !color || !vin) {
      setValidationError('Please fill in all required fields');
      return;
    }
    
    if (isNaN(Number(year)) || Number(year) < 1900 || Number(year) > new Date().getFullYear() + 1) {
      setValidationError('Please enter a valid year');
      return;
    }
    
    setValidationError('');
    
    if (!user) {
      setValidationError('You must be logged in to add a vehicle');
      return;
    }
    
    // In a real app, we would upload the image to a server and get a URL
    // For this demo, we'll just use a sample image URL
    const imageUrl = imageUri || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800';
    
    const success = await addVehicle({
      userId: user.id,
      plateNumber,
      make,
      model,
      year: Number(year),
      color,
      vin,
      imageUrl
    });
    
    if (success) {
      // Clear form
      setPlateNumber('');
      setMake('');
      setModel('');
      setYear('');
      setColor('');
      setVin('');
      setImageUri(null);
      
      Alert.alert(
        'Success',
        'Vehicle added successfully. It will be reviewed by an administrator.',
        [{ text: 'OK' }]
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Vehicle</Text>
            <Text style={styles.subtitle}>
              Enter your vehicle details for inspection
            </Text>
          </View>
          
          {(error || validationError) && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error || validationError}</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.imagePickerContainer} onPress={handleImagePick}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.vehicleImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera size={40} color={COLORS.secondary[400]} />
                <Text style={styles.imagePlaceholderText}>
                  Tap to upload vehicle photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.formContainer}>
            <Input
              label="Plate Number *"
              placeholder="Enter plate number"
              value={plateNumber}
              onChangeText={setPlateNumber}
              autoCapitalize="characters"
            />
            
            <View style={styles.row}>
              <View style={styles.column}>
                <Input
                  label="Make *"
                  placeholder="e.g. Toyota"
                  value={make}
                  onChangeText={setMake}
                />
              </View>
              
              <View style={styles.column}>
                <Input
                  label="Model *"
                  placeholder="e.g. Camry"
                  value={model}
                  onChangeText={setModel}
                />
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.column}>
                <Input
                  label="Year *"
                  placeholder="e.g. 2022"
                  keyboardType="number-pad"
                  value={year}
                  onChangeText={setYear}
                />
              </View>
              
              <View style={styles.column}>
                <Input
                  label="Color *"
                  placeholder="e.g. Blue"
                  value={color}
                  onChangeText={setColor}
                />
              </View>
            </View>
            
            <Input
              label="VIN (Vehicle Identification Number) *"
              placeholder="Enter VIN"
              value={vin}
              onChangeText={setVin}
              autoCapitalize="characters"
            />
            
            <Button
              title="Submit for Inspection"
              onPress={handleSubmit}
              isLoading={loading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: SIZES.padding.xl,
    paddingVertical: SIZES.padding.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  title: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
    marginTop: SIZES.margin.xs,
  },
  errorContainer: {
    backgroundColor: '#FEECEB',
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    margin: SIZES.margin.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT.size.sm,
  },
  imagePickerContainer: {
    margin: SIZES.margin.lg,
    height: 200,
    borderRadius: SIZES.radius.md,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: SIZES.margin.md,
    fontSize: FONT.size.md,
    color: COLORS.text.tertiary,
  },
  formContainer: {
    paddingHorizontal: SIZES.padding.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: SIZES.margin.md,
  },
  submitButton: {
    marginTop: SIZES.margin.xl,
  },
});

export default AddVehicleScreen;
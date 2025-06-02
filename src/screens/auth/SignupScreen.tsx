import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { User, Car } from '../../components/Icons';

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup, isLoading, error } = useAuthStore();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const handleSignup = async () => {
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }
    
    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    setValidationError('');
    const success = await signup(email, password, fullName);
    
    if (!success) {
      // Error message is set by the auth store
    }
  };
  
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Car size={50} color={COLORS.primary[500]} />
            </View>
            <Text style={styles.appName}>Vehicle Inspection</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
            
            {(error || validationError) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || validationError}</Text>
              </View>
            )}
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              icon={<User size={20} color={COLORS.secondary[500]} />}
              iconPosition="left"
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              icon={<User size={20} color={COLORS.secondary[500]} />}
              iconPosition="left"
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <Button
              title="Sign Up"
              onPress={handleSignup}
              isLoading={isLoading}
              style={styles.signupButton}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SIZES.margin.xl,
    marginBottom: SIZES.margin.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.margin.md,
  },
  appName: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
  },
  formContainer: {
    paddingHorizontal: SIZES.padding.xl,
  },
  title: {
    fontSize: FONT.size.xxl,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.xs,
  },
  subtitle: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
    marginBottom: SIZES.margin.xl,
  },
  errorContainer: {
    backgroundColor: '#FEECEB',
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    marginBottom: SIZES.margin.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT.size.sm,
  },
  signupButton: {
    marginTop: SIZES.margin.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.margin.lg,
  },
  loginText: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
  },
  loginLink: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
    color: COLORS.primary[500],
    marginLeft: SIZES.margin.xs,
  },
});

export default SignupScreen;
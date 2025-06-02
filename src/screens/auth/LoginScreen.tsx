import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
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

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setValidationError('Please enter both email and password');
      return;
    }
    
    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    setValidationError('');
    const success = await login(email, password);
    
    if (!success) {
      // Error message is set by the auth store
    }
  };
  
  const handleSignup = () => {
    navigation.navigate('Signup');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
            
            {(error || validationError) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || validationError}</Text>
              </View>
            )}
            
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
            
            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.demoCredentials}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>User: user@example.com / password123</Text>
              <Text style={styles.demoText}>Admin: admin@example.com / admin123</Text>
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
    marginTop: SIZES.margin.xl * 2,
    marginBottom: SIZES.margin.xl,
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
  loginButton: {
    marginTop: SIZES.margin.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.margin.lg,
  },
  signupText: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
  },
  signupLink: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
    color: COLORS.primary[500],
    marginLeft: SIZES.margin.xs,
  },
  demoCredentials: {
    marginTop: SIZES.margin.xl,
    padding: SIZES.padding.md,
    backgroundColor: COLORS.secondary[100],
    borderRadius: SIZES.radius.md,
  },
  demoTitle: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    marginBottom: SIZES.margin.xs,
    color: COLORS.text.secondary,
  },
  demoText: {
    fontSize: FONT.size.sm,
    color: COLORS.text.secondary,
    marginBottom: SIZES.margin.xs,
  },
});

export default LoginScreen;
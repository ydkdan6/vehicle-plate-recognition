import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { User, Settings, LogOut } from '../../components/Icons';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive'
        }
      ]
    );
  };
  
  if (!user) return null;
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.fullName}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionIcon}>
                <User size={20} color={COLORS.primary[500]} />
              </View>
              <Text style={styles.optionText}>Personal Information</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionIcon}>
                <Settings size={20} color={COLORS.primary[500]} />
              </View>
              <Text style={styles.optionText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.optionItem, styles.logoutOption]} 
              onPress={handleLogout}
            >
              <View style={styles.optionIcon}>
                <LogOut size={20} color={COLORS.error} />
              </View>
              <Text style={[styles.optionText, { color: COLORS.error }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.aboutSection}>
          <Text style={styles.appName}>Vehicle Inspection System</Text>
          <Text style={styles.appVersion}>Version 0.1.0</Text>
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
  title: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
  },
  scrollContent: {
    padding: SIZES.padding.lg,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.padding.lg,
    marginBottom: SIZES.margin.lg,
    ...SHADOWS.small,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary[500],
  },
  userInfo: {
    marginLeft: SIZES.margin.lg,
  },
  userName: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.xs,
  },
  userEmail: {
    fontSize: FONT.size.md,
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: SIZES.margin.xl,
  },
  sectionTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.primary,
    marginBottom: SIZES.margin.md,
  },
  optionsList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.secondary,
  },
  optionIcon: {
    marginRight: SIZES.margin.md,
  },
  optionText: {
    fontSize: FONT.size.md,
    color: COLORS.text.primary,
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  aboutSection: {
    alignItems: 'center',
    padding: SIZES.padding.xl,
  },
  appName: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text.secondary,
    marginBottom: SIZES.margin.xs,
  },
  appVersion: {
    fontSize: FONT.size.sm,
    color: COLORS.text.tertiary,
  },
});

export default ProfileScreen;
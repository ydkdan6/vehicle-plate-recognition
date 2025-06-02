import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { 
  Home, PlusCircle, User, BarChart3, ShieldCheck, 
  Car, CheckCircle, Search, Settings 
} from '../components/Icons';
import { COLORS } from '../constants/theme';
import { useAuthStore } from '../stores/authStore';

// Screens - Auth
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Screens - User
import HomeScreen from '../screens/user/HomeScreen';
import AddVehicleScreen from '../screens/user/AddVehicleScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import VehicleDetailScreen from '../screens/user/VehicleDetailScreen';

// Screens - Admin
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
// import AdminVerificationScreen from '../screens/admin/AdminVerificationScreen';
// import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
// import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
// import AdminVerifyPlateScreen from '../screens/admin/AdminVerifyPlateScreen';

// Types
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type UserTabParamList = {
  Home: undefined;
  AddVehicle: undefined;
  Profile: undefined;
};

export type UserStackParamList = {
  UserTabs: NavigatorScreenParams<UserTabParamList>;
  VehicleDetail: { vehicleId: string };
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Verification: undefined;
  Users: undefined;
  Analytics: undefined;
};

export type AdminStackParamList = {
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
  VerifyPlate: { vehicleId: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  UserStack: NavigatorScreenParams<UserStackParamList>;
  AdminStack: NavigatorScreenParams<AdminStackParamList>;
};

// Create navigators
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const UserTab = createBottomTabNavigator<UserTabParamList>();
const UserStack = createNativeStackNavigator<UserStackParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

// User Tab Navigator
const UserTabNavigator = () => (
  <UserTab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary[500],
      tabBarInactiveTintColor: COLORS.secondary[500],
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
        paddingTop: 10,
      },
      headerShown: false,
    }}
  >
    <UserTab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{
        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
      }}
    />
    <UserTab.Screen 
      name="AddVehicle" 
      component={AddVehicleScreen} 
      options={{
        tabBarLabel: 'Add Vehicle',
        tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />
      }}
    />
    <UserTab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{
        tabBarIcon: ({ color, size }) => <User color={color} size={size} />
      }}
    />
  </UserTab.Navigator>
);

// User Stack Navigator (including tabs and other screens)
const UserStackNavigator = () => (
  <UserStack.Navigator screenOptions={{ headerShown: false }}>
    <UserStack.Screen name="UserTabs" component={UserTabNavigator} />
    <UserStack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
  </UserStack.Navigator>
);

// Admin Tab Navigator
const AdminTabNavigator = () => (
  <AdminTab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary[500],
      tabBarInactiveTintColor: COLORS.secondary[500],
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
        paddingTop: 10,
      },
      headerShown: false,
    }}
  >
    <AdminTab.Screen 
      name="Dashboard" 
      component={AdminDashboardScreen} 
      options={{
        tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />
      }}
    />
    {/* <AdminTab.Screen 
      name="Verification" 
      component={AdminVerificationScreen} 
      options={{
        tabBarIcon: ({ color, size }) => <ShieldCheck color={color} size={size} />
      }}
    /> */}
    {/* <AdminTab.Screen 
      name="Users" 
      // component={AdminUsersScreen} 
      options={{
        tabBarIcon: ({ color, size }) => <User color={color} size={size} />
      }}
    />
    <AdminTab.Screen 
      name="Analytics" 
      component={AdminAnalyticsScreen} 
      options={{
        tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />
      }}
    /> */}
  </AdminTab.Navigator>
);

// Admin Stack Navigator (including tabs and other screens)
const AdminStackNavigator = () => (
  <AdminStack.Navigator screenOptions={{ headerShown: false }}>
    <AdminStack.Screen name="AdminTabs" component={AdminTabNavigator} />
    {/* <AdminStack.Screen name="VerifyPlate" component={AdminVerifyPlateScreen} /> */}
  </AdminStack.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  const { user } = useAuthStore();
  
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <RootStack.Screen name="Auth\" component={AuthNavigator} />
      ) : user.role === 'admin' ? (
        <RootStack.Screen name="AdminStack" component={AdminStackNavigator} />
      ) : (
        <RootStack.Screen name="UserStack" component={UserStackNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default AppNavigator;
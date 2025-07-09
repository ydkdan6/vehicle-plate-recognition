import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface Vehicle {
  id: string;
  userId: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  verificationDate?: string;
  imageUrl?: string;
  owner?: string; // Add owner field for display
  documents?: string[]; // Add documents array
}

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  
  fetchUserVehicles: (userId: string) => Promise<void>;
  fetchAllVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'status' | 'registrationDate'>) => Promise<boolean>;
  updateVehicleStatus: (id: string, status: 'approved' | 'rejected') => Promise<boolean>;
  approveVehicle: (id: string) => Promise<boolean>; // Convenience method
  rejectVehicle: (id: string) => Promise<boolean>; // Convenience method
  getVehicleById: (id: string) => Vehicle | undefined;
  getPendingVehicles: () => Vehicle[];
  getVehiclesByPlateNumber: (plateNumber: string) => Vehicle[];
  getStatistics: () => {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byMake: Record<string, number>;
    byYear: Record<string, number>;
  };
}

// Initialize local storage with sample data
const setupInitialVehicles = async () => {
  const vehicles = await AsyncStorage.getItem('vehicles');
  if (!vehicles) {
    const initialVehicles: Vehicle[] = [
      {
        id: '1752023212591',
        userId: 'user1',
        plateNumber: 'ABC-123-XY',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        color: 'Blue',
        vin: 'JT2BF28K9X0123456',
        status: 'pending',
        registrationDate: new Date().toISOString(),
        owner: 'John Doe',
        documents: ['doc1.pdf', 'doc2.pdf']
      },
      {
        id: '1752023212592',
        userId: 'user2',
        plateNumber: 'XYZ-456-AB',
        make: 'Honda',
        model: 'Accord',
        year: 2019,
        color: 'Red',
        vin: 'JHMCF36X8XS123456',
        status: 'pending',
        registrationDate: new Date().toISOString(),
        owner: 'Jane Smith',
        documents: ['doc3.pdf']
      },
      {
        id: '1752023212593',
        userId: 'user3',
        plateNumber: 'DEF-789-CD',
        make: 'Ford',
        model: 'F-150',
        year: 2021,
        color: 'White',
        vin: '1FTFW1ET5MFC12345',
        status: 'approved',
        registrationDate: new Date().toISOString(),
        verificationDate: new Date().toISOString(),
        owner: 'Bob Johnson'
      }
    ];
    await AsyncStorage.setItem('vehicles', JSON.stringify(initialVehicles));
  }
};

export const useVehicleStore = create<VehicleState>((set, get) => {
  // Initialize demo data
  setupInitialVehicles();
  
  return {
    vehicles: [],
    loading: false,
    error: null,
    
    fetchUserVehicles: async (userId: string) => {
      set({ loading: true, error: null });
      
      try {
        // Simulate API call
        const vehiclesJson = await AsyncStorage.getItem('vehicles');
        const allVehicles = JSON.parse(vehiclesJson || '[]');
        const userVehicles = allVehicles.filter((v: Vehicle) => v.userId === userId);
        
        set({ vehicles: userVehicles, loading: false });
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        set({ error: 'Failed to fetch vehicles', loading: false });
      }
    },
    
    fetchAllVehicles: async () => {
      set({ loading: true, error: null });
      
      try {
        // Simulate API call
        const vehiclesJson = await AsyncStorage.getItem('vehicles');
        const allVehicles = JSON.parse(vehiclesJson || '[]');
        set({ vehicles: allVehicles, loading: false });
      } catch (error) {
        console.error('Error fetching all vehicles:', error);
        set({ error: 'Failed to fetch vehicles', loading: false });
      }
    },
    
    addVehicle: async (vehicleData) => {
      set({ loading: true, error: null });
      
      try {
        const vehiclesJson = await AsyncStorage.getItem('vehicles');
        const allVehicles = JSON.parse(vehiclesJson || '[]');
        
        // Check if plate number already exists
        if (allVehicles.some((v: Vehicle) => v.plateNumber === vehicleData.plateNumber)) {
          set({ error: 'A vehicle with this plate number already exists', loading: false });
          return false;
        }
        
        // Create new vehicle with owner info
        const newVehicle: Vehicle = {
          ...vehicleData,
          id: Date.now().toString(),
          status: 'pending',
          registrationDate: new Date().toISOString(),
          owner: vehicleData.owner || 'Unknown Owner' // Fallback for owner
        };
        
        // Add to vehicles array
        allVehicles.push(newVehicle);
        await AsyncStorage.setItem('vehicles', JSON.stringify(allVehicles));
        
        // Update state
        set(state => ({
          vehicles: [...state.vehicles, newVehicle],
          loading: false
        }));
        
        return true;
      } catch (error) {
        console.error('Error adding vehicle:', error);
        set({ error: 'Failed to add vehicle', loading: false });
        return false;
      }
    },
    
    updateVehicleStatus: async (id: string, status: 'approved' | 'rejected') => {
      set({ loading: true, error: null });
      
      try {
        const vehiclesJson = await AsyncStorage.getItem('vehicles');
        const allVehicles = JSON.parse(vehiclesJson || '[]');
        
        // Find vehicle index
        const index = allVehicles.findIndex((v: Vehicle) => v.id === id);
        
        if (index === -1) {
          set({ error: 'Vehicle not found', loading: false });
          return false;
        }
        
        // Update vehicle
        allVehicles[index] = {
          ...allVehicles[index],
          status,
          verificationDate: new Date().toISOString()
        };
        
        // Save to storage
        await AsyncStorage.setItem('vehicles', JSON.stringify(allVehicles));
        
        // Update state
        set(state => ({
          vehicles: state.vehicles.map(v => 
            v.id === id ? { ...v, status, verificationDate: new Date().toISOString() } : v
          ),
          loading: false
        }));
        
        return true;
      } catch (error) {
        console.error('Error updating vehicle status:', error);
        set({ error: 'Failed to update vehicle status', loading: false });
        return false;
      }
    },
    
    // Convenience methods for approve/reject
    approveVehicle: async (id: string) => {
      return await get().updateVehicleStatus(id, 'approved');
    },
    
    rejectVehicle: async (id: string) => {
      return await get().updateVehicleStatus(id, 'rejected');
    },
    
    getVehicleById: (id: string) => {
      return get().vehicles.find(v => v.id === id);
    },
    
    getPendingVehicles: () => {
      return get().vehicles.filter(v => v.status === 'pending');
    },
    
    getVehiclesByPlateNumber: (plateNumber: string) => {
      return get().vehicles.filter(v => 
        v.plateNumber.toLowerCase().includes(plateNumber.toLowerCase())
      );
    },
    
    getStatistics: () => {
      const vehicles = get().vehicles;
      
      // Basic counts
      const total = vehicles.length;
      const pending = vehicles.filter(v => v.status === 'pending').length;
      const approved = vehicles.filter(v => v.status === 'approved').length;
      const rejected = vehicles.filter(v => v.status === 'rejected').length;
      
      // Count by make
      const byMake: Record<string, number> = {};
      vehicles.forEach(v => {
        byMake[v.make] = (byMake[v.make] || 0) + 1;
      });
      
      // Count by year
      const byYear: Record<string, number> = {};
      vehicles.forEach(v => {
        byYear[v.year.toString()] = (byYear[v.year.toString()] || 0) + 1;
      });
      
      return { total, pending, approved, rejected, byMake, byYear };
    }
  };
});
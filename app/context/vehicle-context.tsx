import { createContext, useContext, useMemo, useState, useEffect, type ReactNode, useCallback } from "react";
import { vehiclesAPI, dashboardAPI } from "../services/api";

export type Vehicle = {
  id: number;
  name: string;
  make: string;
  model: string;
  plate: string;
  year: number;
  color: string;
  mileage: number;
};

export type DashboardData = {
  totalFuel: number;
  totalService: number;
  totalExpenses: number;
  totalSpent: number;
  lastFuel: any;
  lastService: any;
};

type VehicleContextValue = {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  selectedVehicle: Vehicle | null;
  dashboardData: DashboardData | null;
  refreshVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => Promise<void>;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
  selectVehicle: (vehicle: Vehicle | null) => void;
  loadDashboard: (vehicleId: number) => Promise<void>;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);

type VehicleProviderProps = {
  children: ReactNode;
};

// Seed data for offline mode
const SEED_VEHICLES: Vehicle[] = [
  {
    id: 1,
    name: "VW",
    make: "Volkswagen",
    model: "Polo",
    plate: "KL45H3782",
    year: 2026,
    color: "Red",
    mileage: 128999,
  },
  {
    id: 2,
    name: "City Runner",
    make: "Honda",
    model: "City",
    plate: "MH12AB1234",
    year: 2023,
    color: "Black",
    mileage: 41000,
  },
  {
    id: 3,
    name: "Family SUV",
    make: "Hyundai",
    model: "Creta",
    plate: "KA01CD5678",
    year: 2024,
    color: "White",
    mileage: 18250,
  },
  {
    id: 4,
    name: "Workhorse",
    make: "Toyota",
    model: "Innova",
    plate: "TN09EF9012",
    year: 2022,
    color: "Silver",
    mileage: 76540,
  },
];

export function VehicleProvider({ children }: VehicleProviderProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const refreshVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await vehiclesAPI.getAll();
      setVehicles(response.data || []);
      setIsOnline(true);
    } catch (err: any) {
      console.log('API not available, using offline mode');
      // Fallback to seed data if API is not available
      setVehicles(SEED_VEHICLES);
      setIsOnline(false);
      setError(null); // Don't show error in offline mode
    } finally {
      setLoading(false);
    }
  }, []);

  const addVehicle = useCallback(async (vehicle: Omit<Vehicle, "id">) => {
    try {
      const response = await vehiclesAPI.create(vehicle);
      setVehicles((prev) => [response.data, ...prev]);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add vehicle');
    }
  }, []);

  const updateVehicle = useCallback(async (id: number, vehicle: Partial<Vehicle>) => {
    try {
      const response = await vehiclesAPI.update(id, vehicle);
      setVehicles((prev) => prev.map((v) => (v.id === id ? response.data : v)));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update vehicle');
    }
  }, []);

  const deleteVehicle = useCallback(async (id: number) => {
    try {
      await vehiclesAPI.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(null);
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete vehicle');
    }
  }, [selectedVehicle]);

  const selectVehicle = useCallback((vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
  }, []);

  const loadDashboard = useCallback(async (vehicleId: number) => {
    try {
      const response = await dashboardAPI.getSummary(vehicleId);
      setDashboardData(response.data);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setDashboardData(null);
    }
  }, []);

  // Load vehicles on mount
  useEffect(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  const value = useMemo(
    () => ({
      vehicles,
      loading,
      error,
      selectedVehicle,
      dashboardData,
      refreshVehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      selectVehicle,
      loadDashboard,
    }),
    [vehicles, loading, error, selectedVehicle, dashboardData, refreshVehicles, addVehicle, updateVehicle, deleteVehicle, selectVehicle, loadDashboard]
  );

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
}

export function useVehicleStore() {
  const context = useContext(VehicleContext);

  if (!context) {
    throw new Error("useVehicleStore must be used within VehicleProvider");
  }

  return context;
}
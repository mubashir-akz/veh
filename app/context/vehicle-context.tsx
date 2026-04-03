import { createContext, useContext, useMemo, useState, useEffect, type ReactNode, useCallback } from "react";
import { vehiclesAPI, fuelAPI, serviceAPI, expensesAPI, dashboardAPI } from "../services/api";

// ==================== TYPES ====================

export type Vehicle = {
  id: number;
  name: string;
  make: string;
  model: string;
  plate?: string;
  year?: number;
  color?: string;
  mileage: number;
  createdAt?: string;
  updatedAt?: string;
};

export type FuelLog = {
  id: number;
  vehicleId: number;
  date: string;
  odometer: number;
  fuelAmount: number;
  pricePerLiter: number;
  totalCost: number;
  fuelType: string;
  location?: string;
  notes?: string;
  createdAt?: string;
};

export type ServiceRecord = {
  id: number;
  vehicleId: number;
  date: string;
  odometer: number;
  serviceType: string;
  description?: string;
  cost?: number;
  serviceCenter?: string;
  nextServiceDate?: string;
  nextServiceOdometer?: number;
  createdAt?: string;
};

export type Expense = {
  id: number;
  vehicleId: number;
  date: string;
  category: string;
  amount: number;
  description?: string;
  createdAt?: string;
};

export type DashboardData = {
  totalFuel: number;
  totalService: number;
  totalExpenses: number;
  totalSpent: number;
  lastFuel: FuelLog | null;
  lastService: ServiceRecord | null;
};

export type DashboardTrend = {
  months: string[];
  fuel: number[];
  service: number[];
  other: number[];
};

// ==================== CONTEXT ====================

type VehicleContextValue = {
  // Vehicle state
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  
  // Selected vehicle
  selectedVehicle: Vehicle | null;
  selectVehicle: (vehicle: Vehicle | null) => void;
  
  // Vehicle actions
  refreshVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => Promise<Vehicle>;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
  
  // Fuel logs
  fuelLogs: FuelLog[];
  loadFuelLogs: (vehicleId: number) => Promise<void>;
  addFuelLog: (vehicleId: number, fuelData: Omit<FuelLog, "id" | "vehicleId" | "totalCost" | "createdAt">) => Promise<void>;
  deleteFuelLog: (id: number) => Promise<void>;
  
  // Service records
  serviceRecords: ServiceRecord[];
  loadServiceRecords: (vehicleId: number) => Promise<void>;
  addServiceRecord: (vehicleId: number, serviceData: Omit<ServiceRecord, "id" | "vehicleId" | "createdAt">) => Promise<void>;
  deleteServiceRecord: (id: number) => Promise<void>;
  
  // Expenses
  expenses: Expense[];
  loadExpenses: (vehicleId: number) => Promise<void>;
  addExpense: (vehicleId: number, expenseData: Omit<Expense, "id" | "vehicleId" | "createdAt">) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  
  // Dashboard
  dashboardData: DashboardData | null;
  loadDashboard: (vehicleId: number) => Promise<void>;
  dashboardTrend: DashboardTrend | null;
  loadDashboardTrend: (vehicleId: number, months?: number) => Promise<void>;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);

type VehicleProviderProps = {
  children: ReactNode;
};

export function VehicleProvider({ children }: VehicleProviderProps) {
  // Vehicle state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  
  // Selected vehicle
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Data state
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardTrend, setDashboardTrend] = useState<DashboardTrend | null>(null);

  // ==================== VEHICLE ACTIONS ====================

  const refreshVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vehiclesAPI.getAll();
      setVehicles(response.data || []);
      setIsOnline(true);
    } catch (err: any) {
      console.error('Failed to fetch vehicles:', err);
      setVehicles([]);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const addVehicle = useCallback(async (vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Promise<Vehicle> => {
    const response = await vehiclesAPI.create(vehicle);
    const newVehicle = response.data;
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  }, []);

  const updateVehicle = useCallback(async (id: number, vehicle: Partial<Vehicle>) => {
    const response = await vehiclesAPI.update(id, vehicle);
    setVehicles((prev) => prev.map((v) => (v.id === id ? response.data : v)));
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(response.data);
    }
  }, [selectedVehicle]);

  const deleteVehicle = useCallback(async (id: number) => {
    await vehiclesAPI.delete(id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(null);
      setFuelLogs([]);
      setServiceRecords([]);
      setExpenses([]);
      setDashboardData(null);
    }
  }, [selectedVehicle]);

  const selectVehicle = useCallback((vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
    // Clear related data when vehicle changes
    setFuelLogs([]);
    setServiceRecords([]);
    setExpenses([]);
    setDashboardData(null);
    setDashboardTrend(null);
  }, []);

  // ==================== FUEL LOG ACTIONS ====================

  const loadFuelLogs = useCallback(async (vehicleId: number) => {
    try {
      const response = await fuelAPI.getByVehicle(vehicleId);
      setFuelLogs(response.data || []);
    } catch (err: any) {
      console.error('Failed to load fuel logs:', err);
      setFuelLogs([]);
    }
  }, []);

  const addFuelLog = useCallback(async (vehicleId: number, fuelData: Omit<FuelLog, "id" | "vehicleId" | "totalCost" | "createdAt">) => {
    const response = await fuelAPI.add(vehicleId, fuelData);
    setFuelLogs((prev) => [response.data, ...prev]);
  }, []);

  const deleteFuelLog = useCallback(async (id: number) => {
    await fuelAPI.delete(id);
    setFuelLogs((prev) => prev.filter((log) => log.id !== id));
  }, []);

  // ==================== SERVICE RECORD ACTIONS ====================

  const loadServiceRecords = useCallback(async (vehicleId: number) => {
    try {
      const response = await serviceAPI.getByVehicle(vehicleId);
      setServiceRecords(response.data || []);
    } catch (err: any) {
      console.error('Failed to load service records:', err);
      setServiceRecords([]);
    }
  }, []);

  const addServiceRecord = useCallback(async (vehicleId: number, serviceData: Omit<ServiceRecord, "id" | "vehicleId" | "createdAt">) => {
    const response = await serviceAPI.add(vehicleId, serviceData);
    setServiceRecords((prev) => [response.data, ...prev]);
  }, []);

  const deleteServiceRecord = useCallback(async (id: number) => {
    await serviceAPI.delete(id);
    setServiceRecords((prev) => prev.filter((record) => record.id !== id));
  }, []);

  // ==================== EXPENSE ACTIONS ====================

  const loadExpenses = useCallback(async (vehicleId: number) => {
    try {
      const response = await expensesAPI.getByVehicle(vehicleId);
      setExpenses(response.data || []);
    } catch (err: any) {
      console.error('Failed to load expenses:', err);
      setExpenses([]);
    }
  }, []);

  const addExpense = useCallback(async (vehicleId: number, expenseData: Omit<Expense, "id" | "vehicleId" | "createdAt">) => {
    const response = await expensesAPI.add(vehicleId, expenseData);
    setExpenses((prev) => [response.data, ...prev]);
  }, []);

  const deleteExpense = useCallback(async (id: number) => {
    await expensesAPI.delete(id);
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  // ==================== DASHBOARD ACTIONS ====================

  const loadDashboard = useCallback(async (vehicleId: number) => {
    try {
      const response = await dashboardAPI.getSummary(vehicleId);
      setDashboardData(response.data);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setDashboardData(null);
    }
  }, []);

  const loadDashboardTrend = useCallback(async (vehicleId: number, months = 6) => {
    try {
      const response = await dashboardAPI.getTrend(vehicleId, months);
      setDashboardTrend(response.data);
    } catch (err: any) {
      console.error('Failed to load dashboard trend:', err);
      setDashboardTrend(null);
    }
  }, []);

  // Load vehicles on mount
  useEffect(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  const value = useMemo(
    () => ({
      // Vehicle state
      vehicles,
      loading,
      error,
      isOnline,
      
      // Selected vehicle
      selectedVehicle,
      selectVehicle,
      
      // Vehicle actions
      refreshVehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      
      // Fuel logs
      fuelLogs,
      loadFuelLogs,
      addFuelLog,
      deleteFuelLog,
      
      // Service records
      serviceRecords,
      loadServiceRecords,
      addServiceRecord,
      deleteServiceRecord,
      
      // Expenses
      expenses,
      loadExpenses,
      addExpense,
      deleteExpense,
      
      // Dashboard
      dashboardData,
      loadDashboard,
      dashboardTrend,
      loadDashboardTrend,
    }),
    [
      vehicles,
      loading,
      error,
      isOnline,
      selectedVehicle,
      fuelLogs,
      serviceRecords,
      expenses,
      dashboardData,
      dashboardTrend,
      refreshVehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      selectVehicle,
      loadFuelLogs,
      addFuelLog,
      deleteFuelLog,
      loadServiceRecords,
      addServiceRecord,
      deleteServiceRecord,
      loadExpenses,
      addExpense,
      deleteExpense,
      loadDashboard,
      loadDashboardTrend,
    ]
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
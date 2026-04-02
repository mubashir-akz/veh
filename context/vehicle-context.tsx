import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  dashboardAPI,
  expensesAPI,
  fuelAPI,
  hasAuthToken,
  serviceAPI,
  vehiclesAPI,
  type CreateVehiclePayload,
  type VehicleResponse,
} from "../app/services/api";

export type Vehicle = {
  id: string;
  name: string;
  make: string;
  model: string;
  plate: string;
  year: number;
  color: string;
  mileage: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateVehicleInput = CreateVehiclePayload;

export type FuelLog = {
  id: string;
  vehicleId: string;
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

export type AddFuelLogInput = {
  date: string;
  odometer: number;
  fuelAmount: number;
  pricePerLiter: number;
  fuelType?: string;
  location?: string;
  notes?: string;
};

export type ServiceRecord = {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  serviceType: string;
  description?: string;
  cost: number;
  serviceCenter?: string;
  nextServiceDate?: string;
  nextServiceOdometer?: number;
  createdAt?: string;
};

export type AddServiceRecordInput = {
  date: string;
  odometer: number;
  serviceType: string;
  description?: string;
  cost?: number;
  serviceCenter?: string;
  nextServiceDate?: string;
  nextServiceOdometer?: number;
};

export type Expense = {
  id: string;
  vehicleId: string;
  date: string;
  category: string;
  amount: number;
  description?: string;
  createdAt?: string;
};

export type AddExpenseInput = {
  date: string;
  category: string;
  amount: number;
  description?: string;
};

export type DashboardData = {
  totalFuel: number;
  totalService: number;
  totalExpenses: number;
  totalSpent: number;
  lastFuel: FuelLog | null;
  lastService: ServiceRecord | null;
};

type FuelLogResponse = {
  id: number;
  vehicleId: number;
  date: string;
  odometer: number;
  fuelAmount: number;
  pricePerLiter: number;
  totalCost: number;
  fuelType?: string | null;
  location?: string | null;
  notes?: string | null;
  createdAt?: string;
};

type ServiceRecordResponse = {
  id: number;
  vehicleId: number;
  date: string;
  odometer: number;
  serviceType: string;
  description?: string | null;
  cost?: number | null;
  serviceCenter?: string | null;
  nextServiceDate?: string | null;
  nextServiceOdometer?: number | null;
  createdAt?: string;
};

type ExpenseResponse = {
  id: number;
  vehicleId: number;
  date: string;
  category: string;
  amount: number;
  description?: string | null;
  createdAt?: string;
};

type DashboardResponse = {
  totalFuel?: number;
  totalService?: number;
  totalExpenses?: number;
  totalSpent?: number;
  lastFuel?: FuelLogResponse | null;
  lastService?: ServiceRecordResponse | null;
};

type VehicleContextValue = {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  fuelLogs: FuelLog[];
  serviceRecords: ServiceRecord[];
  expenses: Expense[];
  dashboardData: DashboardData | null;
  refreshVehicles: () => Promise<void>;
  addVehicle: (vehicle: CreateVehicleInput) => Promise<Vehicle>;
  loadFuelLogs: (vehicleId: string) => Promise<void>;
  addFuelLog: (vehicleId: string, fuelData: AddFuelLogInput) => Promise<void>;
  deleteFuelLog: (id: string) => Promise<void>;
  loadServiceRecords: (vehicleId: string) => Promise<void>;
  addServiceRecord: (vehicleId: string, serviceData: AddServiceRecordInput) => Promise<void>;
  deleteServiceRecord: (id: string) => Promise<void>;
  loadExpenses: (vehicleId: string) => Promise<void>;
  addExpense: (vehicleId: string, expenseData: AddExpenseInput) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  loadDashboard: (vehicleId: string) => Promise<void>;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);

type VehicleProviderProps = {
  children: ReactNode;
};

function normalizeVehicle(vehicle: VehicleResponse): Vehicle {
  return {
    id: String(vehicle.id),
    name: vehicle.name,
    make: vehicle.make,
    model: vehicle.model,
    plate: vehicle.plate,
    year: vehicle.year ?? 0,
    color: vehicle.color?.trim() || "Unknown",
    mileage: vehicle.mileage ?? 0,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
}

function normalizeFuelLog(log: FuelLogResponse): FuelLog {
  return {
    id: String(log.id),
    vehicleId: String(log.vehicleId),
    date: log.date,
    odometer: log.odometer,
    fuelAmount: log.fuelAmount,
    pricePerLiter: log.pricePerLiter,
    totalCost: log.totalCost,
    fuelType: log.fuelType?.trim() || "Petrol",
    location: log.location?.trim() || undefined,
    notes: log.notes?.trim() || undefined,
    createdAt: log.createdAt,
  };
}

function normalizeServiceRecord(record: ServiceRecordResponse): ServiceRecord {
  return {
    id: String(record.id),
    vehicleId: String(record.vehicleId),
    date: record.date,
    odometer: record.odometer,
    serviceType: record.serviceType,
    description: record.description?.trim() || undefined,
    cost: record.cost ?? 0,
    serviceCenter: record.serviceCenter?.trim() || undefined,
    nextServiceDate: record.nextServiceDate ?? undefined,
    nextServiceOdometer: record.nextServiceOdometer ?? undefined,
    createdAt: record.createdAt,
  };
}

function normalizeExpense(expense: ExpenseResponse): Expense {
  return {
    id: String(expense.id),
    vehicleId: String(expense.vehicleId),
    date: expense.date,
    category: expense.category,
    amount: expense.amount,
    description: expense.description?.trim() || undefined,
    createdAt: expense.createdAt,
  };
}

function normalizeDashboard(data: DashboardResponse): DashboardData {
  return {
    totalFuel: data.totalFuel ?? 0,
    totalService: data.totalService ?? 0,
    totalExpenses: data.totalExpenses ?? 0,
    totalSpent: data.totalSpent ?? 0,
    lastFuel: data.lastFuel ? normalizeFuelLog(data.lastFuel) : null,
    lastService: data.lastService ? normalizeServiceRecord(data.lastService) : null,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while talking to the vehicle service.";
}

export function VehicleProvider({ children }: VehicleProviderProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const refreshVehicles = useCallback(async () => {
    if (!hasAuthToken()) {
      setVehicles([]);
      setFuelLogs([]);
      setServiceRecords([]);
      setExpenses([]);
      setDashboardData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await vehiclesAPI.getAll();
      setVehicles(data.map(normalizeVehicle));
      setError(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  const addVehicle = useCallback(async (vehicle: CreateVehicleInput) => {
    try {
      const createdVehicle = normalizeVehicle(await vehiclesAPI.create(vehicle));
      setVehicles((prev) => [createdVehicle, ...prev]);
      setError(null);
      return createdVehicle;
    } catch (requestError) {
      const message = getErrorMessage(requestError);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const loadFuelLogs = useCallback(async (vehicleId: string) => {
    if (!hasAuthToken() || !vehicleId) {
      setFuelLogs([]);
      return;
    }

    try {
      const data = await fuelAPI.getByVehicle<FuelLogResponse>(vehicleId);
      setFuelLogs(data.map(normalizeFuelLog));
      setError(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setFuelLogs([]);
    }
  }, []);

  const addFuelLog = useCallback(async (vehicleId: string, fuelData: AddFuelLogInput) => {
    const created = await fuelAPI.add<FuelLogResponse>(vehicleId, fuelData);
    setFuelLogs((prev) => [normalizeFuelLog(created), ...prev]);
  }, []);

  const deleteFuelLog = useCallback(async (id: string) => {
    await fuelAPI.delete(id);
    setFuelLogs((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const loadServiceRecords = useCallback(async (vehicleId: string) => {
    if (!hasAuthToken() || !vehicleId) {
      setServiceRecords([]);
      return;
    }

    try {
      const data = await serviceAPI.getByVehicle<ServiceRecordResponse>(vehicleId);
      setServiceRecords(data.map(normalizeServiceRecord));
      setError(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setServiceRecords([]);
    }
  }, []);

  const addServiceRecord = useCallback(async (vehicleId: string, serviceData: AddServiceRecordInput) => {
    const created = await serviceAPI.add<ServiceRecordResponse>(vehicleId, serviceData);
    setServiceRecords((prev) => [normalizeServiceRecord(created), ...prev]);
  }, []);

  const deleteServiceRecord = useCallback(async (id: string) => {
    await serviceAPI.delete(id);
    setServiceRecords((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const loadExpenses = useCallback(async (vehicleId: string) => {
    if (!hasAuthToken() || !vehicleId) {
      setExpenses([]);
      return;
    }

    try {
      const data = await expensesAPI.getByVehicle<ExpenseResponse>(vehicleId);
      setExpenses(data.map(normalizeExpense));
      setError(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setExpenses([]);
    }
  }, []);

  const addExpense = useCallback(async (vehicleId: string, expenseData: AddExpenseInput) => {
    const created = await expensesAPI.add<ExpenseResponse>(vehicleId, expenseData);
    setExpenses((prev) => [normalizeExpense(created), ...prev]);
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    await expensesAPI.delete(id);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const loadDashboard = useCallback(async (vehicleId: string) => {
    if (!hasAuthToken() || !vehicleId) {
      setDashboardData(null);
      return;
    }

    try {
      const data = await dashboardAPI.getSummary<DashboardResponse>(vehicleId);
      setDashboardData(normalizeDashboard(data));
      setError(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setDashboardData(null);
    }
  }, []);

  useEffect(() => {
    void refreshVehicles();
  }, [refreshVehicles]);

  const value = useMemo(
    () => ({
      vehicles,
      loading,
      error,
      fuelLogs,
      serviceRecords,
      expenses,
      dashboardData,
      refreshVehicles,
      addVehicle,
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
    }),
    [
      addExpense,
      addFuelLog,
      addServiceRecord,
      addVehicle,
      dashboardData,
      deleteExpense,
      deleteFuelLog,
      deleteServiceRecord,
      error,
      expenses,
      fuelLogs,
      loadDashboard,
      loadExpenses,
      loadFuelLogs,
      loadServiceRecords,
      loading,
      refreshVehicles,
      serviceRecords,
      vehicles,
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

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
  hasAuthToken,
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

type VehicleContextValue = {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  refreshVehicles: () => Promise<void>;
  addVehicle: (vehicle: CreateVehicleInput) => Promise<Vehicle>;
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

  const refreshVehicles = useCallback(async () => {
    if (!hasAuthToken()) {
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

  useEffect(() => {
    void refreshVehicles();
  }, [refreshVehicles]);

  const value = useMemo(
    () => ({
      vehicles,
      loading,
      error,
      refreshVehicles,
      addVehicle,
    }),
    [addVehicle, error, loading, refreshVehicles, vehicles]
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

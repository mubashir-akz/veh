import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Vehicle = {
  id: string;
  name: string;
  make: string;
  model: string;
  plate: string;
  year: number;
  color: string;
  mileage: number;
};

type VehicleContextValue = {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);

type VehicleProviderProps = {
  children: ReactNode;
};

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "seed-1",
    name: "VW",
    make: "Volkswagen",
    model: "Polo",
    plate: "KL45H3782",
    year: 2026,
    color: "Red",
    mileage: 128999,
  },
  {
    id: "seed-2",
    name: "City Runner",
    make: "Honda",
    model: "City",
    plate: "MH12AB1234",
    year: 2023,
    color: "Black",
    mileage: 41000,
  },
  {
    id: "seed-3",
    name: "Family SUV",
    make: "Hyundai",
    model: "Creta",
    plate: "KA01CD5678",
    year: 2024,
    color: "White",
    mileage: 18250,
  },
  {
    id: "seed-4",
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
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  const addVehicle = (vehicle: Omit<Vehicle, "id">) => {
    setVehicles((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...vehicle,
      },
    ]);
  };

  const value = useMemo(
    () => ({
      vehicles,
      addVehicle,
    }),
    [vehicles]
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

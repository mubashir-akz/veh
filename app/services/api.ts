const API_BASE_URL = "https://veh-nestjs-api-686058802069.us-central1.run.app/api";

type FetchApiOptions = Omit<RequestInit, "body" | "headers"> & {
    body?: unknown;
    headers?: Record<string, string>;
};

type WrappedResponse<T> = {
    data: T;
};

export type VehicleResponse = {
    id: number;
    name: string;
    make: string;
    model: string;
    plate: string;
    year?: number | null;
    color?: string | null;
    mileage?: number | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateVehiclePayload = {
    name: string;
    make: string;
    model: string;
    plate: string;
    year?: number;
    color?: string;
    mileage?: number;
};

function isWrappedResponse<T>(value: unknown): value is WrappedResponse<T> {
    return typeof value === "object" && value !== null && "data" in value;
}

function getErrorMessage(data: unknown) {
    if (typeof data === "object" && data !== null) {
        if ("error" in data && typeof data.error === "string") {
            return data.error;
        }

        if ("message" in data && typeof data.message === "string") {
            return data.message;
        }
    }

    return "API request failed";
}

async function fetchAPI<T>(endpoint: string, options: FetchApiOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { body, headers, ...restOptions } = options;
    const config: RequestInit = {
        ...restOptions,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    if (body !== undefined) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");
    const hasJsonBody = contentType?.includes("application/json");
    const data = hasJsonBody ? ((await response.json()) as unknown) : null;

    if (!response.ok) {
        throw new Error(getErrorMessage(data));
    }

    if (isWrappedResponse<T>(data)) {
        return data.data;
    }

    return data as T;
}

export const vehiclesAPI = {
    getAll: () => fetchAPI<VehicleResponse[]>("/vehicles"),
    getById: (id: number | string) => fetchAPI<VehicleResponse>(`/vehicles/${id}`),
    create: (vehicle: CreateVehiclePayload) =>
        fetchAPI<VehicleResponse>("/vehicles", {
            method: "POST",
            body: vehicle,
        }),
    update: (id: number | string, vehicle: Partial<CreateVehiclePayload>) =>
        fetchAPI<VehicleResponse>(`/vehicles/${id}`, {
            method: "PUT",
            body: vehicle,
        }),
    delete: (id: number | string) =>
        fetchAPI<void>(`/vehicles/${id}`, {
            method: "DELETE",
        }),
};

export const fuelAPI = {
    getByVehicle: <T>(vehicleId: number | string) => fetchAPI<T[]>(`/vehicles/${vehicleId}/fuel`),
    add: <T>(vehicleId: number | string, fuelData: unknown) =>
        fetchAPI<T>(`/vehicles/${vehicleId}/fuel`, {
            method: "POST",
            body: fuelData,
        }),
    delete: (id: number | string) =>
        fetchAPI<void>(`/fuel/${id}`, {
            method: "DELETE",
        }),
};

export const serviceAPI = {
    getByVehicle: <T>(vehicleId: number | string) => fetchAPI<T[]>(`/vehicles/${vehicleId}/service`),
    add: <T>(vehicleId: number | string, serviceData: unknown) =>
        fetchAPI<T>(`/vehicles/${vehicleId}/service`, {
            method: "POST",
            body: serviceData,
        }),
    delete: (id: number | string) =>
        fetchAPI<void>(`/service/${id}`, {
            method: "DELETE",
        }),
};

export const expensesAPI = {
    getByVehicle: <T>(vehicleId: number | string) => fetchAPI<T[]>(`/vehicles/${vehicleId}/expenses`),
    add: <T>(vehicleId: number | string, expenseData: unknown) =>
        fetchAPI<T>(`/vehicles/${vehicleId}/expenses`, {
            method: "POST",
            body: expenseData,
        }),
    delete: (id: number | string) =>
        fetchAPI<void>(`/expenses/${id}`, {
            method: "DELETE",
        }),
};

export const dashboardAPI = {
    getSummary: <T>(vehicleId: number | string) => fetchAPI<T>(`/dashboard/${vehicleId}`),
};

export default {
    vehicles: vehiclesAPI,
    fuel: fuelAPI,
    service: serviceAPI,
    expenses: expensesAPI,
    dashboard: dashboardAPI,
};
// API Configuration
// Cloud Run deployed API
const API_BASE_URL = 'https://veh-nestjs-api-686058802069.us-central1.run.app/api';

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from storage
    const token = await getToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    };
    
    if (options.body) {
        config.body = JSON.stringify(options.body);
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }
        
        // API returns { data: [...] } or direct object
        return data.data || data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== AUTH API ====================

export const authAPI = {
    register: (data: { email: string; password: string; name: string }) => 
        fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),
    
    login: (data: { email: string; password: string }) => 
        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),
};

// Token storage (using keychain or async storage - simple version for now)
let storedToken: string | null = null;
let storedUser: any = null;

export const tokenStorage = {
    setToken: (token: string, user: any) => {
        storedToken = token;
        storedUser = user;
    },
    getToken: async () => storedToken,
    getUser: async () => storedUser,
    clear: () => {
        storedToken = null;
        storedUser = null;
    },
};

async function getToken() {
    return storedToken;
}

// ==================== VEHICLES API ====================

export const vehiclesAPI = {
    getAll: () => fetchAPI('/vehicles'),
    getById: (id: number) => fetchAPI(`/vehicles/${id}`),
    create: (vehicle: any) => fetchAPI('/vehicles', { method: 'POST', body: vehicle }),
    update: (id: number, vehicle: any) => fetchAPI(`/vehicles/${id}`, { method: 'PUT', body: vehicle }),
    delete: (id: number) => fetchAPI(`/vehicles/${id}`, { method: 'DELETE' }),
};

// ==================== FUEL LOGS API ====================

export const fuelAPI = {
    getByVehicle: (vehicleId: number) => fetchAPI(`/vehicles/${vehicleId}/fuel`),
    add: (vehicleId: number, fuelData: any) => fetchAPI(`/vehicles/${vehicleId}/fuel`, { method: 'POST', body: fuelData }),
    delete: (id: number) => fetchAPI(`/fuel/${id}`, { method: 'DELETE' }),
};

// ==================== SERVICE RECORDS API ====================

export const serviceAPI = {
    getByVehicle: (vehicleId: number) => fetchAPI(`/vehicles/${vehicleId}/service`),
    add: (vehicleId: number, serviceData: any) => fetchAPI(`/vehicles/${vehicleId}/service`, { method: 'POST', body: serviceData }),
    delete: (id: number) => fetchAPI(`/service/${id}`, { method: 'DELETE' }),
};

// ==================== EXPENSES API ====================

export const expensesAPI = {
    getByVehicle: (vehicleId: number) => fetchAPI(`/vehicles/${vehicleId}/expenses`),
    add: (vehicleId: number, expenseData: any) => fetchAPI(`/vehicles/${vehicleId}/expenses`, { method: 'POST', body: expenseData }),
    delete: (id: number) => fetchAPI(`/expenses/${id}`, { method: 'DELETE' }),
};

// ==================== DASHBOARD API ====================

export const dashboardAPI = {
    getSummary: (vehicleId: number) => fetchAPI(`/dashboard/${vehicleId}`),
};

export default {
    auth: authAPI,
    vehicles: vehiclesAPI,
    fuel: fuelAPI,
    service: serviceAPI,
    expenses: expensesAPI,
    dashboard: dashboardAPI,
    tokenStorage,
};
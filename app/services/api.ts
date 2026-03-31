// API Configuration
// Cloud Run deployed API
const API_BASE_URL = 'https://veh-api-686058802069.us-central1.run.app/api';

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
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
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== VEHICLES API ====================

export const vehiclesAPI = {
    // Get all vehicles
    getAll: () => fetchAPI('/vehicles'),
    
    // Get single vehicle
    getById: (id) => fetchAPI(`/vehicles/${id}`),
    
    // Create vehicle
    create: (vehicle) => fetchAPI('/vehicles', {
        method: 'POST',
        body: vehicle,
    }),
    
    // Update vehicle
    update: (id, vehicle) => fetchAPI(`/vehicles/${id}`, {
        method: 'PUT',
        body: vehicle,
    }),
    
    // Delete vehicle
    delete: (id) => fetchAPI(`/vehicles/${id}`, {
        method: 'DELETE',
    }),
};

// ==================== FUEL LOGS API ====================

export const fuelAPI = {
    // Get fuel logs for vehicle
    getByVehicle: (vehicleId) => fetchAPI(`/vehicles/${vehicleId}/fuel`),
    
    // Add fuel log
    add: (vehicleId, fuelData) => fetchAPI(`/vehicles/${vehicleId}/fuel`, {
        method: 'POST',
        body: fuelData,
    }),
    
    // Delete fuel log
    delete: (id) => fetchAPI(`/fuel/${id}`, {
        method: 'DELETE',
    }),
};

// ==================== SERVICE HISTORY API ====================

export const serviceAPI = {
    // Get service history for vehicle
    getByVehicle: (vehicleId) => fetchAPI(`/vehicles/${vehicleId}/service`),
    
    // Add service record
    add: (vehicleId, serviceData) => fetchAPI(`/vehicles/${vehicleId}/service`, {
        method: 'POST',
        body: serviceData,
    }),
    
    // Delete service record
    delete: (id) => fetchAPI(`/service/${id}`, {
        method: 'DELETE',
    }),
};

// ==================== EXPENSES API ====================

export const expensesAPI = {
    // Get expenses for vehicle
    getByVehicle: (vehicleId) => fetchAPI(`/vehicles/${vehicleId}/expenses`),
    
    // Add expense
    add: (vehicleId, expenseData) => fetchAPI(`/vehicles/${vehicleId}/expenses`, {
        method: 'POST',
        body: expenseData,
    }),
    
    // Delete expense
    delete: (id) => fetchAPI(`/expenses/${id}`, {
        method: 'DELETE',
    }),
};

// ==================== DASHBOARD API ====================

export const dashboardAPI = {
    // Get dashboard summary for vehicle
    getSummary: (vehicleId) => fetchAPI(`/dashboard/${vehicleId}`),
};

export default {
    vehicles: vehiclesAPI,
    fuel: fuelAPI,
    service: serviceAPI,
    expenses: expensesAPI,
    dashboard: dashboardAPI,
};
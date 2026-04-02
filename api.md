# Vehicle Management API — Full Documentation

Base URL: `http://localhost:3000`

---

## Table of Contents

- [Authentication](#authentication)
  - [Register](#1-register)
  - [Login](#2-login)
- [Vehicles](#vehicles)
  - [Get All Vehicles](#3-get-all-vehicles)
  - [Get Vehicle by ID](#4-get-vehicle-by-id)
  - [Create Vehicle](#5-create-vehicle)
  - [Update Vehicle](#6-update-vehicle)
  - [Delete Vehicle](#7-delete-vehicle)
- [Fuel Logs](#fuel-logs)
  - [Get Fuel Logs](#8-get-fuel-logs)
  - [Add Fuel Log](#9-add-fuel-log)
  - [Delete Fuel Log](#10-delete-fuel-log)
- [Expenses](#expenses)
  - [Get Expenses](#11-get-expenses)
  - [Add Expense](#12-add-expense)
  - [Delete Expense](#13-delete-expense)
- [Service Records](#service-records)
  - [Get Service Records](#14-get-service-records)
  - [Add Service Record](#15-add-service-record)
  - [Delete Service Record](#16-delete-service-record)
- [Dashboard](#dashboard)
  - [Get Dashboard Summary](#17-get-dashboard-summary)
- [Error Responses](#error-responses)

---

## Authentication

Authentication uses JWT (JSON Web Token). Protected endpoints require the token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

### 1. Register

Creates a new user account.

- **Method:** `POST`
- **URL:** `/auth/register`
- **Auth Required:** No

**Request Body**

| Field      | Type   | Required | Validation            |
|------------|--------|----------|-----------------------|
| `email`    | string | Yes      | Valid email format    |
| `password` | string | Yes      | Minimum 6 characters |
| `name`     | string | Yes      | Non-empty string      |

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "John Doe"
}
```

**Response `201 Created`**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 2. Login

Authenticates an existing user and returns a JWT token.

- **Method:** `POST`
- **URL:** `/auth/login`
- **Auth Required:** No

**Request Body**

| Field      | Type   | Required | Validation         |
|------------|--------|----------|--------------------|
| `email`    | string | Yes      | Valid email format |
| `password` | string | Yes      | Non-empty string   |

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response `200 OK`**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## Vehicles

All vehicle endpoints require a valid JWT token.

---

### 3. Get All Vehicles

Returns all vehicles belonging to the authenticated user.

- **Method:** `GET`
- **URL:** `/api/vehicles`
- **Auth Required:** Yes

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "name": "My Car",
    "make": "Toyota",
    "model": "Camry",
    "plate": "ABC-1234",
    "year": 2020,
    "color": "White",
    "mileage": 15000,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 4. Get Vehicle by ID

Returns a single vehicle by its ID.

- **Method:** `GET`
- **URL:** `/api/vehicles/:id`
- **Auth Required:** Yes

**Path Parameters**

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `id`      | integer | Yes      | Vehicle ID  |

**Response `200 OK`**

```json
{
  "id": 1,
  "name": "My Car",
  "make": "Toyota",
  "model": "Camry",
  "plate": "ABC-1234",
  "year": 2020,
  "color": "White",
  "mileage": 15000,
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 5. Create Vehicle

Creates a new vehicle for the authenticated user.

- **Method:** `POST`
- **URL:** `/api/vehicles`
- **Auth Required:** Yes

**Request Body**

| Field     | Type    | Required | Validation              |
|-----------|---------|----------|-------------------------|
| `name`    | string  | Yes      | Non-empty string        |
| `make`    | string  | Yes      | Non-empty string        |
| `model`   | string  | Yes      | Non-empty string        |
| `plate`   | string  | No       | Optional string         |
| `year`    | integer | No       | Minimum value: 1900     |
| `color`   | string  | No       | Optional string         |
| `mileage` | number  | No       | Minimum value: 0        |

```json
{
  "name": "My Car",
  "make": "Toyota",
  "model": "Camry",
  "plate": "ABC-1234",
  "year": 2020,
  "color": "White",
  "mileage": 15000
}
```

**Response `201 Created`**

```json
{
  "id": 1,
  "name": "My Car",
  "make": "Toyota",
  "model": "Camry",
  "plate": "ABC-1234",
  "year": 2020,
  "color": "White",
  "mileage": 15000,
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 6. Update Vehicle

Updates an existing vehicle. All fields are optional — only include the fields you want to change.

- **Method:** `PUT`
- **URL:** `/api/vehicles/:id`
- **Auth Required:** Yes

**Path Parameters**

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `id`      | integer | Yes      | Vehicle ID  |

**Request Body**

| Field     | Type    | Required | Validation          |
|-----------|---------|----------|---------------------|
| `name`    | string  | No       | Optional string     |
| `make`    | string  | No       | Optional string     |
| `model`   | string  | No       | Optional string     |
| `plate`   | string  | No       | Optional string     |
| `year`    | integer | No       | Optional integer    |
| `color`   | string  | No       | Optional string     |
| `mileage` | number  | No       | Optional number     |

```json
{
  "mileage": 16500,
  "color": "Silver"
}
```

**Response `200 OK`**

```json
{
  "id": 1,
  "name": "My Car",
  "make": "Toyota",
  "model": "Camry",
  "plate": "ABC-1234",
  "year": 2020,
  "color": "Silver",
  "mileage": 16500,
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-02-01T00:00:00.000Z"
}
```

---

### 7. Delete Vehicle

Deletes a vehicle by its ID.

- **Method:** `DELETE`
- **URL:** `/api/vehicles/:id`
- **Auth Required:** Yes

**Path Parameters**

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `id`      | integer | Yes      | Vehicle ID  |

**Response `200 OK`**

```json
{
  "message": "Vehicle deleted successfully"
}
```

---

## Fuel Logs

All fuel log endpoints require a valid JWT token.

---

### 8. Get Fuel Logs

Returns all fuel logs for a specific vehicle.

- **Method:** `GET`
- **URL:** `/api/vehicles/:vehicleId/fuel`
- **Auth Required:** Yes

**Path Parameters**

| Parameter   | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `vehicleId` | integer | Yes      | Vehicle ID  |

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "date": "2024-03-15",
    "odometer": 15200,
    "fuelAmount": 45.5,
    "pricePerLiter": 1.85,
    "totalCost": 84.17,
    "fuelType": "Petrol",
    "location": "Shell Station, Main St",
    "notes": "Full tank",
    "vehicleId": 1,
    "userId": 1,
    "createdAt": "2024-03-15T10:00:00.000Z"
  }
]
```

---

### 9. Add Fuel Log

Records a new fuel fill-up for a vehicle. `totalCost` is computed automatically as `fuelAmount × pricePerLiter`.

- **Method:** `POST`
- **URL:** `/api/vehicles/:vehicleId/fuel`
- **Auth Required:** Yes

**Path Parameters**

| Parameter   | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `vehicleId` | integer | Yes      | Vehicle ID  |

**Request Body**

| Field           | Type   | Required | Validation       |
|-----------------|--------|----------|------------------|
| `date`          | string | Yes      | ISO date string (`YYYY-MM-DD`) |
| `odometer`      | number | Yes      | Minimum value: 0 |
| `fuelAmount`    | number | Yes      | Minimum value: 0 (litres) |
| `pricePerLiter` | number | Yes      | Minimum value: 0 |
| `fuelType`      | string | No       | e.g. `"Petrol"`, `"Diesel"`, `"Electric"` |
| `location`      | string | No       | Optional string  |
| `notes`         | string | No       | Optional string  |

```json
{
  "date": "2024-03-15",
  "odometer": 15200,
  "fuelAmount": 45.5,
  "pricePerLiter": 1.85,
  "fuelType": "Petrol",
  "location": "Shell Station, Main St",
  "notes": "Full tank"
}
```

**Response `201 Created`**

```json
{
  "id": 1,
  "date": "2024-03-15",
  "odometer": 15200,
  "fuelAmount": 45.5,
  "pricePerLiter": 1.85,
  "totalCost": 84.17,
  "fuelType": "Petrol",
  "location": "Shell Station, Main St",
  "notes": "Full tank",
  "vehicleId": 1,
  "userId": 1,
  "createdAt": "2024-03-15T10:00:00.000Z"
}
```

---

### 10. Delete Fuel Log

Deletes a fuel log entry by its ID.

- **Method:** `DELETE`
- **URL:** `/api/fuel/:id`
- **Auth Required:** Yes

**Path Parameters**

| Parameter | Type    | Required | Description   |
|-----------|---------|----------|---------------|
| `id`      | integer | Yes      | Fuel Log ID   |

**Response `200 OK`**

```json
{
  "message": "Fuel log deleted successfully"
}
```

---

## Expenses

All expense endpoints require a valid JWT token.

---

### 11. Get Expenses

Returns all expenses for a specific vehicle.

- **Method:** `GET`
- **URL:** `/api/vehicles/:vehicleId/expenses`
- **Auth Required:** Yes

**Path Parameters**

| Parameter   | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `vehicleId` | integer | Yes      | Vehicle ID  |

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "date": "2024-03-10",
    "category": "Insurance",
    "amount": 350.00,
    "description": "Annual insurance renewal",
    "vehicleId": 1,
    "userId": 1,
    "createdAt": "2024-03-10T09:00:00.000Z"
  }
]
```

---

### 12. Add Expense

Records a new expense for a vehicle.

- **Method:** `POST`
- **URL:** `/api/vehicles/:vehicleId/expenses`
- **Auth Required:** Yes

**Path Parameters**

| Parameter   | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `vehicleId` | integer | Yes      | Vehicle ID  |

**Request Body**

| Field         | Type   | Required | Validation       |
|---------------|--------|----------|------------------|
| `date`        | string | Yes      | ISO date string (`YYYY-MM-DD`) |
| `category`    | string | Yes      | e.g. `"Insurance"`, `"Tax"`, `"Parking"`, `"Repair"` |
| `amount`      | number | Yes      | Minimum value: 0 |
| `description` | string | No       | Optional string  |

```json
{
  "date": "2024-03-10",
  "category": "Insurance",
  "amount": 350.00,
  "description": "Annual insurance renewal"
}
```

**Response `201 Created`**

```json
{
  "id": 1,
  "date": "2024-03-10",
  "category": "Insurance",
  "amount": 350.00,
  "description": "Annual insurance renewal",
  "vehicleId": 1,
  "userId": 1,
  "createdAt": "2024-03-10T09:00:00.000Z"
}
```

---

### 13. Delete Expense

Deletes an expense entry by its ID.

- **Method:** `DELETE`
- **URL:** `/api/expenses/:id`
- **Auth Required:** Yes

**Path Parameters**

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `id`      | integer | Yes      | Expense ID  |

**Response `200 OK`**

```json
{
  "message": "Expense deleted successfully"
}
```

---

## Service Records

All service record endpoints require a valid JWT token.

---

### 14. Get Service Records

Returns all service records for a specific vehicle.

- **Method:** `GET`
- **URL:** `/api/vehicles/:vehicleId/service`
- **Auth Required:** Yes

**Path Parameters**

| Parameter   | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `vehicleId` | integer | Yes      | Vehicle ID  |

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "date": "2024-02-20",
    "odometer": 15000,
    "serviceType": "Oil Change",
    "description": "Full synthetic oil change",
    "cost": 75.00,
    "serviceCenter": "QuickLube, Broadway",
    "nextServiceDate": "2024-08-20",
    "nextServiceOdometer": 20000,
    "vehicleId": 1,
    "userId": 1,
    "createdAt": "2024-02-20T11:00:00.000Z"
  }
]
```

---

### 15. Add Service Record

Records a new service/maintenance entry for a vehicle.

- **Method:** `POST`
- **URL:** `/api/vehicles/:vehicleId/service`
- **Auth Required:** Yes

**Path Parameters**

| Parameter   | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `vehicleId` | integer | Yes      | Vehicle ID  |

**Request Body**

| Field                  | Type   | Required | Validation       |
|------------------------|--------|----------|------------------|
| `date`                 | string | Yes      | ISO date string (`YYYY-MM-DD`) |
| `odometer`             | number | Yes      | Minimum value: 0 |
| `serviceType`          | string | Yes      | e.g. `"Oil Change"`, `"Tyre Rotation"`, `"Brake Service"` |
| `description`          | string | No       | Optional string  |
| `cost`                 | number | No       | Minimum value: 0 |
| `serviceCenter`        | string | No       | Optional string  |
| `nextServiceDate`      | string | No       | ISO date string (`YYYY-MM-DD`) |
| `nextServiceOdometer`  | number | No       | Optional number  |

```json
{
  "date": "2024-02-20",
  "odometer": 15000,
  "serviceType": "Oil Change",
  "description": "Full synthetic oil change",
  "cost": 75.00,
  "serviceCenter": "QuickLube, Broadway",
  "nextServiceDate": "2024-08-20",
  "nextServiceOdometer": 20000
}
```

**Response `201 Created`**

```json
{
  "id": 1,
  "date": "2024-02-20",
  "odometer": 15000,
  "serviceType": "Oil Change",
  "description": "Full synthetic oil change",
  "cost": 75.00,
  "serviceCenter": "QuickLube, Broadway",
  "nextServiceDate": "2024-08-20",
  "nextServiceOdometer": 20000,
  "vehicleId": 1,
  "userId": 1,
  "createdAt": "2024-02-20T11:00:00.000Z"
}
```

---

### 16. Delete Service Record

Deletes a service record entry by its ID.

- **Method:** `DELETE`
- **URL:** `/api/service/:id`
- **Auth Required:** Yes

**Path Parameters**

| Parameter | Type    | Required | Description       |
|-----------|---------|----------|-------------------|
| `id`      | integer | Yes      | Service Record ID |

**Response `200 OK`**

```json
{
  "message": "Service record deleted successfully"
}
```

---

## Dashboard

### 17. Get Dashboard Summary

Returns an aggregated financial summary for a specific vehicle, including total spend across fuel, service, and expenses, as well as the most recent fuel and service entries.

- **Method:** `GET`
- **URL:** `/api/dashboard/:vehicleId`
- **Auth Required:** Yes

**Path Parameters**

| Parameter   | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `vehicleId` | integer | Yes      | Vehicle ID  |

**Response `200 OK`**

```json
{
  "totalFuel": 420.85,
  "totalService": 150.00,
  "totalExpenses": 350.00,
  "totalSpent": 920.85,
  "lastFuel": {
    "id": 5,
    "date": "2024-03-15",
    "odometer": 15200,
    "fuelAmount": 45.5,
    "pricePerLiter": 1.85,
    "totalCost": 84.17,
    "fuelType": "Petrol",
    "location": "Shell Station, Main St",
    "notes": null,
    "vehicleId": 1,
    "userId": 1,
    "createdAt": "2024-03-15T10:00:00.000Z"
  },
  "lastService": {
    "id": 3,
    "date": "2024-02-20",
    "odometer": 15000,
    "serviceType": "Oil Change",
    "description": "Full synthetic oil change",
    "cost": 75.00,
    "serviceCenter": "QuickLube, Broadway",
    "nextServiceDate": "2024-08-20",
    "nextServiceOdometer": 20000,
    "vehicleId": 1,
    "userId": 1,
    "createdAt": "2024-02-20T11:00:00.000Z"
  }
}
```

> `lastFuel` and `lastService` will be `null` if no entries exist for the vehicle.

---

## Error Responses

All endpoints return standard HTTP error responses in the following format:

```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

**Common HTTP Status Codes**

| Status | Meaning                                      |
|--------|----------------------------------------------|
| `400`  | Bad Request — invalid or missing fields      |
| `401`  | Unauthorized — missing or invalid JWT token  |
| `404`  | Not Found — resource does not exist          |
| `500`  | Internal Server Error — unexpected error     |

---

## Quick Reference

| Method   | Endpoint                              | Auth | Description                  |
|----------|---------------------------------------|------|------------------------------|
| `POST`   | `/auth/register`                      | No   | Register new user            |
| `POST`   | `/auth/login`                         | No   | Login and get JWT token      |
| `GET`    | `/api/vehicles`                       | Yes  | List all vehicles            |
| `GET`    | `/api/vehicles/:id`                   | Yes  | Get vehicle by ID            |
| `POST`   | `/api/vehicles`                       | Yes  | Create vehicle               |
| `PUT`    | `/api/vehicles/:id`                   | Yes  | Update vehicle               |
| `DELETE` | `/api/vehicles/:id`                   | Yes  | Delete vehicle               |
| `GET`    | `/api/vehicles/:vehicleId/fuel`       | Yes  | List fuel logs for vehicle   |
| `POST`   | `/api/vehicles/:vehicleId/fuel`       | Yes  | Add fuel log                 |
| `DELETE` | `/api/fuel/:id`                       | Yes  | Delete fuel log              |
| `GET`    | `/api/vehicles/:vehicleId/expenses`   | Yes  | List expenses for vehicle    |
| `POST`   | `/api/vehicles/:vehicleId/expenses`   | Yes  | Add expense                  |
| `DELETE` | `/api/expenses/:id`                   | Yes  | Delete expense               |
| `GET`    | `/api/vehicles/:vehicleId/service`    | Yes  | List service records         |
| `POST`   | `/api/vehicles/:vehicleId/service`    | Yes  | Add service record           |
| `DELETE` | `/api/service/:id`                    | Yes  | Delete service record        |
| `GET`    | `/api/dashboard/:vehicleId`           | Yes  | Get vehicle dashboard        |
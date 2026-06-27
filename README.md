# TeleHealth Pro 🏥
### Online Doctor Consultation Platform

A full-stack enterprise-grade telehealth platform built with Java Spring Boot, React.js, PostgreSQL, Docker, and AWS.

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Deployment](#deployment)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 21, Spring Boot 3.2, Spring Security, JWT |
| **Database** | PostgreSQL 15 |
| **ORM** | Spring Data JPA / Hibernate |
| **Frontend** | React 18, Redux Toolkit, Material UI |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Cloud** | AWS EC2, RDS, S3 |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |

---

## 📁 Project Structure

```
telehealth-pro/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/telehealth/pro/
│   │   ├── controller/         # REST controllers
│   │   ├── service/            # Business logic interfaces
│   │   │   └── impl/           # Service implementations
│   │   ├── repository/         # JPA repositories
│   │   ├── entity/             # JPA entities
│   │   ├── dto/
│   │   │   ├── request/        # Request DTOs
│   │   │   └── response/       # Response DTOs
│   │   ├── security/
│   │   │   ├── jwt/            # JWT filter & utility
│   │   │   └── config/         # Security configuration
│   │   ├── exception/          # Custom exceptions & global handler
│   │   └── enums/              # Role, Status enums
│   └── Dockerfile
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/
│   │   │   └── common/         # Shared components (Navbar, PrivateRoute)
│   │   ├── services/           # Axios API services
│   │   ├── store/
│   │   │   └── slices/         # Redux slices
│   │   └── App.js
│   ├── nginx.conf
│   └── Dockerfile
├── database/
│   └── schema.sql              # Full DB schema + seed data
└── deployment/
    ├── docker-compose.yml
    └── .github-ci.yml          # CI/CD pipeline
```

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)
- Maven 3.9+

---

### Option 1: Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/telehealth-pro.git
cd telehealth-pro

# Start all services (DB + Backend + Frontend)
docker-compose -f deployment/docker-compose.yml up --build

# App will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# Swagger UI: http://localhost:8080/api/swagger-ui.html
```

---

### Option 2: Run Locally

#### Backend
```bash
# 1. Create PostgreSQL database
createdb telehealth_db
psql telehealth_db < database/schema.sql

# 2. Configure database in:
# backend/src/main/resources/application.properties

# 3. Build and run
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@telehealth.com | admin123 |

---

## 📡 API Documentation

Access Swagger UI at: `http://localhost:8080/api/swagger-ui.html`

### Key Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |

#### Doctors (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors/public` | List all doctors (paginated) |
| GET | `/api/doctors/public/search` | Search by name/specialization |
| GET | `/api/doctors/public/{id}` | Get doctor details |

#### Appointments (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments/book/{patientUserId}` | Book appointment |
| GET | `/api/appointments/patient/{patientId}` | Patient's appointments |
| GET | `/api/appointments/doctor/{doctorId}` | Doctor's appointments |
| PUT | `/api/appointments/{id}/status` | Update status |
| DELETE | `/api/appointments/{id}/cancel` | Cancel appointment |

### Sample Request: Register
```json
POST /api/auth/register
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "PATIENT"
}
```

### Sample Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "userId": 1,
    "email": "jane@example.com",
    "fullName": "Jane Smith",
    "role": "PATIENT"
  }
}
```

---

## ✨ Features

### Patient Features
- ✅ Register and manage profile
- ✅ Search doctors by specialization, name
- ✅ Book appointments with date/time selection
- ✅ View appointment history
- ✅ Cancel upcoming appointments
- ✅ View prescriptions

### Doctor Features
- ✅ Create and manage doctor profile
- ✅ Toggle availability
- ✅ View and manage appointments
- ✅ Confirm / complete appointments
- ✅ Write prescriptions

### Admin Features
- ✅ View all doctors and manage them
- ✅ Platform statistics dashboard
- ✅ Remove doctors from platform

### Platform Features
- ✅ JWT Authentication with refresh tokens
- ✅ Role-based access control (PATIENT, DOCTOR, ADMIN)
- ✅ Paginated doctor listing
- ✅ Conflict-free appointment slot booking
- ✅ Swagger API documentation
- ✅ Global exception handling
- ✅ Input validation

---

## ☁️ AWS Deployment

### Architecture
```
Internet → CloudFront → S3 (Frontend)
                     → ALB → EC2 (Backend)
                                → RDS PostgreSQL
```

### Steps
1. Launch EC2 (t3.medium, Ubuntu 22.04)
2. Install Docker and Docker Compose
3. Configure RDS PostgreSQL
4. Set environment variables
5. Run `docker-compose up -d`
6. Configure domain and SSL with Nginx + Certbot

---

## 🧪 Running Tests

```bash
# Backend unit tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

---

## 👥 User Roles & Permissions

| Feature | PATIENT | DOCTOR | ADMIN |
|---------|---------|--------|-------|
| View doctors | ✅ | ✅ | ✅ |
| Book appointment | ✅ | ❌ | ✅ |
| Manage appointments | ✅ | ✅ | ✅ |
| Create doctor profile | ❌ | ✅ | ✅ |
| Delete doctors | ❌ | ❌ | ✅ |
| Admin dashboard | ❌ | ❌ | ✅ |

---

## 📄 License

This project is built for educational purposes as part of a university course on enterprise application development.

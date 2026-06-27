-- ============================================
-- TeleHealth Pro - Database Schema
-- PostgreSQL
-- ============================================

CREATE DATABASE telehealth_db;
\c telehealth_db;

-- Users table
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT')),
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    profile_image_url VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Specializations table
CREATE TABLE specializations (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url    VARCHAR(500)
);

-- Doctors table
CREATE TABLE doctors (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialization_id   BIGINT REFERENCES specializations(id),
    license_number      VARCHAR(100),
    qualification       VARCHAR(255),
    experience_years    INT,
    consultation_fee    DECIMAL(10,2),
    bio                 TEXT,
    hospital_name       VARCHAR(255),
    hospital_address    TEXT,
    rating              DOUBLE PRECISION DEFAULT 0.0,
    total_reviews       INT DEFAULT 0,
    available           BOOLEAN DEFAULT TRUE
);

-- Patients table
CREATE TABLE patients (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth       DATE,
    gender              VARCHAR(20),
    blood_group         VARCHAR(10),
    address             TEXT,
    emergency_contact   VARCHAR(100),
    allergies           TEXT,
    medical_history     TEXT
);

-- Doctor Availability table
CREATE TABLE doctor_availability (
    id                      BIGSERIAL PRIMARY KEY,
    doctor_id               BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week             INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time              TIME NOT NULL,
    end_time                TIME NOT NULL,
    is_active               BOOLEAN DEFAULT TRUE,
    slot_duration_minutes   INT DEFAULT 30
);

-- Appointments table
CREATE TABLE appointments (
    id                  BIGSERIAL PRIMARY KEY,
    patient_id          BIGINT NOT NULL REFERENCES patients(id),
    doctor_id           BIGINT NOT NULL REFERENCES doctors(id),
    appointment_date    DATE NOT NULL,
    appointment_time    TIME NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                            CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED','NO_SHOW')),
    reason_for_visit    TEXT,
    doctor_notes        TEXT,
    video_call_link     VARCHAR(500),
    consultation_fee    DECIMAL(10,2),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id                  BIGSERIAL PRIMARY KEY,
    appointment_id      BIGINT NOT NULL REFERENCES appointments(id),
    amount              DECIMAL(10,2) NOT NULL,
    status              VARCHAR(20) DEFAULT 'PENDING'
                            CHECK (status IN ('PENDING','SUCCESS','FAILED','REFUNDED')),
    transaction_id      VARCHAR(255),
    payment_method      VARCHAR(50),
    razorpay_order_id   VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions table
CREATE TABLE prescriptions (
    id              BIGSERIAL PRIMARY KEY,
    appointment_id  BIGINT NOT NULL REFERENCES appointments(id),
    medications     TEXT,
    diagnosis       TEXT,
    instructions    TEXT,
    valid_until     DATE,
    pdf_url         VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id              BIGSERIAL PRIMARY KEY,
    doctor_id       BIGINT NOT NULL REFERENCES doctors(id),
    patient_id      BIGINT NOT NULL REFERENCES patients(id),
    appointment_id  BIGINT REFERENCES appointments(id),
    rating          INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    type        VARCHAR(50),
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_specialization ON doctors(specialization_id);
CREATE INDEX idx_doctors_available ON doctors(available);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_payments_appointment ON payments(appointment_id);
CREATE INDEX idx_reviews_doctor ON reviews(doctor_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ============================================
-- Seed Data
-- ============================================
INSERT INTO specializations (name, description) VALUES
  ('Cardiology', 'Heart and cardiovascular system'),
  ('Dermatology', 'Skin, hair and nails'),
  ('Neurology', 'Brain and nervous system'),
  ('Pediatrics', 'Children healthcare'),
  ('Orthopedics', 'Bones, joints and muscles'),
  ('Psychiatry', 'Mental health'),
  ('Gynecology', 'Women reproductive health'),
  ('General Medicine', 'Primary and general healthcare'),
  ('Ophthalmology', 'Eye care'),
  ('ENT', 'Ear, nose and throat');

-- Admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('admin@telehealth.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'System', 'Admin', 'ADMIN');

-- Doctors (password: doctor123)
-- BCrypt for 'doctor123' is '$2a$10$kP5x62FUXdF/m9F2G7r1xeE0/iO/x7nvy6oOEqKz6E11566t8lP9O'
INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES
  ('john.doe@telehealth.com', '$2a$10$kP5x62FUXdF/m9F2G7r1xeE0/iO/x7nvy6oOEqKz6E11566t8lP9O', 'John', 'Doe', '1234567890', 'DOCTOR'),
  ('sarah.smith@telehealth.com', '$2a$10$kP5x62FUXdF/m9F2G7r1xeE0/iO/x7nvy6oOEqKz6E11566t8lP9O', 'Sarah', 'Smith', '0987654321', 'DOCTOR'),
  ('emily.davis@telehealth.com', '$2a$10$kP5x62FUXdF/m9F2G7r1xeE0/iO/x7nvy6oOEqKz6E11566t8lP9O', 'Emily', 'Davis', '5551234567', 'DOCTOR'),
  ('robert.wilson@telehealth.com', '$2a$10$kP5x62FUXdF/m9F2G7r1xeE0/iO/x7nvy6oOEqKz6E11566t8lP9O', 'Robert', 'Wilson', '4449876543', 'DOCTOR'),
  ('william.jones@telehealth.com', '$2a$10$kP5x62FUXdF/m9F2G7r1xeE0/iO/x7nvy6oOEqKz6E11566t8lP9O', 'William', 'Jones', '3338765432', 'DOCTOR');

-- Doctor Profiles
INSERT INTO doctors (user_id, specialization_id, license_number, qualification, experience_years, consultation_fee, bio, hospital_name, hospital_address, rating, total_reviews, available) VALUES
  ((SELECT id FROM users WHERE email = 'john.doe@telehealth.com'), (SELECT id FROM specializations WHERE name = 'Cardiology'), 'LIC12345', 'MD - Cardiology, MBBS', 12, 150.00, 'Dr. John Doe is a senior cardiologist with over 12 years of experience in managing cardiac conditions and performing diagnostic procedures.', 'City Heart Center', '123 Cardiac Way, Medical District', 4.8, 5, TRUE),
  ((SELECT id FROM users WHERE email = 'sarah.smith@telehealth.com'), (SELECT id FROM specializations WHERE name = 'Dermatology'), 'LIC67890', 'MD - Dermatology, MBBS', 8, 120.00, 'Dr. Sarah Smith specializes in clinical and aesthetic dermatology, helping patients with skin disorders, hair loss, and anti-aging treatments.', 'Skin & Wellness Clinic', '456 Radiance Blvd, Suite 200', 4.9, 5, TRUE),
  ((SELECT id FROM users WHERE email = 'emily.davis@telehealth.com'), (SELECT id FROM specializations WHERE name = 'Pediatrics'), 'LIC54321', 'MD - Pediatrics, DCH, MBBS', 15, 100.00, 'Dr. Emily Davis is a compassionate pediatrician dedicated to providing comprehensive healthcare for infants, children, and adolescents.', 'Happy Kids Clinic', '789 Childhood Lane', 4.7, 5, TRUE),
  ((SELECT id FROM users WHERE email = 'robert.wilson@telehealth.com'), (SELECT id FROM specializations WHERE name = 'General Medicine'), 'LIC98765', 'MD - General Medicine, MBBS', 10, 80.00, 'Dr. Robert Wilson offers primary care services for acute and chronic conditions, emphasizing preventative care and overall well-being.', 'Family Health Practice', '101 Wellness Circle', 4.6, 5, TRUE),
  ((SELECT id FROM users WHERE email = 'william.jones@telehealth.com'), (SELECT id FROM specializations WHERE name = 'Neurology'), 'LIC45678', 'MD - Neurology, MBBS', 14, 200.00, 'Dr. William Jones is an expert in treating neurological disorders, including migraines, epilepsy, neuropathy, and Parkinson''s disease.', 'Neuroscience Institute', '789 Brain Wave Avenue', 4.9, 5, TRUE);

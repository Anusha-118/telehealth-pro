import api from './api';

export const doctorService = {
  getAll: (params) => api.get('/doctors/public', { params }),
  search: (params) => api.get('/doctors/public/search', { params }),
  getById: (id) => api.get(`/doctors/public/${id}`),
  createProfile: (userId, data) => api.post(`/doctors/profile/${userId}`, data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  toggleAvailability: (id) => api.put(`/doctors/${id}/toggle-availability`),
  delete: (id) => api.delete(`/doctors/${id}`),
};

export const appointmentService = {
  book: (patientUserId, data) => api.post(`/appointments/book/${patientUserId}`, data),
  getById: (id) => api.get(`/appointments/${id}`),
  getPatientAppointments: (patientId, params) =>
    api.get(`/appointments/patient/${patientId}`, { params }),
  getDoctorAppointments: (doctorId, params) =>
    api.get(`/appointments/doctor/${doctorId}`, { params }),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, null, { params: { status } }),
  cancel: (id) => api.delete(`/appointments/${id}/cancel`),
};

export const specializationService = {
  getAll: () => api.get('/specializations'),
};

export const paymentService = {
  create: (data) => api.post('/payments', data),
  getByAppointment: (appointmentId) => api.get(`/payments/appointment/${appointmentId}`),
};

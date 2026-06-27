package com.telehealth.pro.service;

import com.telehealth.pro.dto.request.AppointmentRequest;
import com.telehealth.pro.dto.response.AppointmentResponse;
import com.telehealth.pro.enums.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AppointmentService {
    AppointmentResponse bookAppointment(Long patientUserId, AppointmentRequest request);
    AppointmentResponse getAppointmentById(Long id);
    Page<AppointmentResponse> getPatientAppointments(Long patientId, Pageable pageable);
    Page<AppointmentResponse> getDoctorAppointments(Long doctorId, Pageable pageable);
    AppointmentResponse updateStatus(Long id, AppointmentStatus status);
    void cancelAppointment(Long id);
}

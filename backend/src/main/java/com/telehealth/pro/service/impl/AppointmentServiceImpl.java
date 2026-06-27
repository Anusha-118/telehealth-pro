package com.telehealth.pro.service.impl;

import com.telehealth.pro.dto.request.AppointmentRequest;
import com.telehealth.pro.dto.response.AppointmentResponse;
import com.telehealth.pro.entity.Appointment;
import com.telehealth.pro.entity.Doctor;
import com.telehealth.pro.entity.Patient;
import com.telehealth.pro.enums.AppointmentStatus;
import com.telehealth.pro.exception.BadRequestException;
import com.telehealth.pro.exception.ResourceNotFoundException;
import com.telehealth.pro.repository.AppointmentRepository;
import com.telehealth.pro.repository.DoctorRepository;
import com.telehealth.pro.repository.PatientRepository;
import com.telehealth.pro.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public AppointmentResponse bookAppointment(Long patientUserId, AppointmentRequest request) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", request.getDoctorId()));

        if (!doctor.isAvailable()) {
            throw new BadRequestException("Doctor is not available for appointments");
        }

        // Check slot availability
        List<Appointment> existingAppointments = appointmentRepository
                .findBookedSlots(doctor.getId(), request.getAppointmentDate());

        boolean slotTaken = existingAppointments.stream()
                .anyMatch(a -> a.getAppointmentTime().equals(request.getAppointmentTime()));

        if (slotTaken) {
            throw new BadRequestException("This time slot is already booked. Please choose another time.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reasonForVisit(request.getReasonForVisit())
                .consultationFee(doctor.getConsultationFee())
                .status(AppointmentStatus.PENDING)
                .build();

        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Override
    public AppointmentResponse getAppointmentById(Long id) {
        return mapToResponse(appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id)));
    }

    @Override
    public Page<AppointmentResponse> getPatientAppointments(Long patientId, Pageable pageable) {
        return appointmentRepository.findByPatientId(patientId, pageable).map(this::mapToResponse);
    }

    @Override
    public Page<AppointmentResponse> getDoctorAppointments(Long doctorId, Pageable pageable) {
        return appointmentRepository.findByDoctorId(doctorId, pageable).map(this::mapToResponse);
    }

    @Override
    public AppointmentResponse updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
        appointment.setStatus(status);
        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Override
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed appointment");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    private AppointmentResponse mapToResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getUser().getFirstName() + " " + a.getPatient().getUser().getLastName())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getUser().getFirstName() + " " + a.getDoctor().getUser().getLastName())
                .specialization(a.getDoctor().getSpecialization() != null ?
                        a.getDoctor().getSpecialization().getName() : null)
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .status(a.getStatus())
                .reasonForVisit(a.getReasonForVisit())
                .doctorNotes(a.getDoctorNotes())
                .videoCallLink(a.getVideoCallLink())
                .consultationFee(a.getConsultationFee())
                .createdAt(a.getCreatedAt())
                .build();
    }
}

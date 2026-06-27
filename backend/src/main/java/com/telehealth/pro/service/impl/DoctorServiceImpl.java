package com.telehealth.pro.service.impl;

import com.telehealth.pro.dto.request.DoctorRequest;
import com.telehealth.pro.dto.response.DoctorResponse;
import com.telehealth.pro.entity.Doctor;
import com.telehealth.pro.entity.Specialization;
import com.telehealth.pro.entity.User;
import com.telehealth.pro.exception.ResourceNotFoundException;
import com.telehealth.pro.repository.DoctorRepository;
import com.telehealth.pro.repository.SpecializationRepository;
import com.telehealth.pro.repository.UserRepository;
import com.telehealth.pro.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SpecializationRepository specializationRepository;

    @Override
    public DoctorResponse createDoctorProfile(Long userId, DoctorRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Specialization spec = specializationRepository.findById(request.getSpecializationId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialization", request.getSpecializationId()));

        Doctor doctor = Doctor.builder()
                .user(user)
                .specialization(spec)
                .licenseNumber(request.getLicenseNumber())
                .qualification(request.getQualification())
                .experienceYears(request.getExperienceYears())
                .consultationFee(request.getConsultationFee())
                .bio(request.getBio())
                .hospitalName(request.getHospitalName())
                .hospitalAddress(request.getHospitalAddress())
                .build();

        return mapToResponse(doctorRepository.save(doctor));
    }

    @Override
    public DoctorResponse getDoctorById(Long id) {
        return mapToResponse(doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id)));
    }

    @Override
    public DoctorResponse getDoctorByUserId(Long userId) {
        return mapToResponse(doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + userId)));
    }

    @Override
    public Page<DoctorResponse> getAllDoctors(Pageable pageable) {
        return doctorRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public Page<DoctorResponse> searchDoctors(String specialization, String name, Pageable pageable) {
        return doctorRepository.searchDoctors(specialization, name, pageable).map(this::mapToResponse);
    }

    @Override
    public DoctorResponse updateDoctorProfile(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));

        Specialization spec = specializationRepository.findById(request.getSpecializationId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialization", request.getSpecializationId()));

        doctor.setSpecialization(spec);
        doctor.setQualification(request.getQualification());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setBio(request.getBio());
        doctor.setHospitalName(request.getHospitalName());
        doctor.setHospitalAddress(request.getHospitalAddress());

        return mapToResponse(doctorRepository.save(doctor));
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
        doctorRepository.deleteById(id);
    }

    @Override
    public DoctorResponse toggleAvailability(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
        doctor.setAvailable(!doctor.isAvailable());
        return mapToResponse(doctorRepository.save(doctor));
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .userId(doctor.getUser().getId())
                .firstName(doctor.getUser().getFirstName())
                .lastName(doctor.getUser().getLastName())
                .email(doctor.getUser().getEmail())
                .phone(doctor.getUser().getPhone())
                .profileImageUrl(doctor.getUser().getProfileImageUrl())
                .specialization(doctor.getSpecialization() != null ? doctor.getSpecialization().getName() : null)
                .licenseNumber(doctor.getLicenseNumber())
                .qualification(doctor.getQualification())
                .experienceYears(doctor.getExperienceYears())
                .consultationFee(doctor.getConsultationFee())
                .bio(doctor.getBio())
                .hospitalName(doctor.getHospitalName())
                .hospitalAddress(doctor.getHospitalAddress())
                .rating(doctor.getRating())
                .totalReviews(doctor.getTotalReviews())
                .available(doctor.isAvailable())
                .build();
    }
}

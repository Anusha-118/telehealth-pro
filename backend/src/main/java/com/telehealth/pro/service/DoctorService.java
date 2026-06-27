package com.telehealth.pro.service;

import com.telehealth.pro.dto.request.DoctorRequest;
import com.telehealth.pro.dto.response.DoctorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DoctorService {
    DoctorResponse createDoctorProfile(Long userId, DoctorRequest request);
    DoctorResponse getDoctorById(Long id);
    DoctorResponse getDoctorByUserId(Long userId);
    Page<DoctorResponse> getAllDoctors(Pageable pageable);
    Page<DoctorResponse> searchDoctors(String specialization, String name, Pageable pageable);
    DoctorResponse updateDoctorProfile(Long id, DoctorRequest request);
    void deleteDoctor(Long id);
    DoctorResponse toggleAvailability(Long id);
}

package com.telehealth.pro.controller;

import com.telehealth.pro.dto.request.DoctorRequest;
import com.telehealth.pro.dto.response.ApiResponse;
import com.telehealth.pro.dto.response.DoctorResponse;
import com.telehealth.pro.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctors", description = "Doctor management APIs")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/public")
    @Operation(summary = "Get all available doctors (public)")
    public ResponseEntity<ApiResponse<Page<DoctorResponse>>> getAllDoctors(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getAllDoctors(pageable), "Doctors fetched"));
    }

    @GetMapping("/public/search")
    @Operation(summary = "Search doctors by specialization or name")
    public ResponseEntity<ApiResponse<Page<DoctorResponse>>> searchDoctors(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String name,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                doctorService.searchDoctors(specialization, name, pageable), "Search results"));
    }

    @GetMapping("/public/{id}")
    @Operation(summary = "Get doctor by ID")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getDoctorById(id), "Doctor found"));
    }

    @PostMapping("/profile/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Create doctor profile")
    public ResponseEntity<ApiResponse<DoctorResponse>> createProfile(
            @PathVariable Long userId,
            @Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(doctorService.createDoctorProfile(userId, request), "Profile created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Update doctor profile")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.updateDoctorProfile(id, request), "Profile updated"));
    }

    @PutMapping("/{id}/toggle-availability")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Toggle doctor availability")
    public ResponseEntity<ApiResponse<DoctorResponse>> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.toggleAvailability(id), "Availability updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete doctor")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Doctor deleted"));
    }
}

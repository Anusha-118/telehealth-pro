package com.telehealth.pro.repository;

import com.telehealth.pro.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByUserId(Long userId);

    Page<Doctor> findBySpecializationId(Long specializationId, Pageable pageable);

    @Query("SELECT d FROM Doctor d WHERE d.available = true AND " +
           "(:specialization IS NULL OR d.specialization.name ILIKE %:specialization%) AND " +
           "(:name IS NULL OR CONCAT(d.user.firstName, ' ', d.user.lastName) ILIKE %:name%)")
    Page<Doctor> searchDoctors(@Param("specialization") String specialization,
                               @Param("name") String name,
                               Pageable pageable);

    @Query("SELECT d FROM Doctor d ORDER BY d.rating DESC")
    Page<Doctor> findTopRatedDoctors(Pageable pageable);
}

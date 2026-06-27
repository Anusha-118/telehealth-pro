package com.telehealth.pro.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "doctor_availability")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // 0=Sunday, 1=Monday, ..., 6=Saturday
    private Integer dayOfWeek;

    private LocalTime startTime;
    private LocalTime endTime;

    @Builder.Default
    private boolean isActive = true;

    // Slot duration in minutes (e.g. 30)
    @Builder.Default
    private Integer slotDurationMinutes = 30;
}

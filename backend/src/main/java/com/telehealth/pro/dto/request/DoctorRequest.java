package com.telehealth.pro.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class DoctorRequest {
    @NotNull private Long specializationId;
    @NotBlank private String licenseNumber;
    @NotBlank private String qualification;
    @NotNull private Integer experienceYears;
    @NotNull private BigDecimal consultationFee;
    private String bio;
    private String hospitalName;
    private String hospitalAddress;
}

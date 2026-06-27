package com.telehealth.pro.config;

import com.telehealth.pro.entity.Doctor;
import com.telehealth.pro.entity.Specialization;
import com.telehealth.pro.entity.User;
import com.telehealth.pro.enums.Role;
import com.telehealth.pro.repository.DoctorRepository;
import com.telehealth.pro.repository.SpecializationRepository;
import com.telehealth.pro.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final SpecializationRepository specializationRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          DoctorRepository doctorRepository,
                          SpecializationRepository specializationRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.specializationRepository = specializationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (specializationRepository.count() == 0) {
            seedSpecializations();
        }
        if (userRepository.findByEmail("admin@telehealth.com").isEmpty()) {
            seedAdmin();
        }
        if (doctorRepository.count() == 0) {
            seedDoctors();
        }
    }

    private void seedSpecializations() {
        List<Specialization> specializations = Arrays.asList(
            Specialization.builder().name("Cardiology").description("Heart and cardiovascular system").build(),
            Specialization.builder().name("Dermatology").description("Skin, hair and nails").build(),
            Specialization.builder().name("Neurology").description("Brain and nervous system").build(),
            Specialization.builder().name("Pediatrics").description("Children healthcare").build(),
            Specialization.builder().name("Orthopedics").description("Bones, joints and muscles").build(),
            Specialization.builder().name("Psychiatry").description("Mental health").build(),
            Specialization.builder().name("Gynecology").description("Women reproductive health").build(),
            Specialization.builder().name("General Medicine").description("Primary and general healthcare").build(),
            Specialization.builder().name("Ophthalmology").description("Eye care").build(),
            Specialization.builder().name("ENT").description("Ear, nose and throat").build()
        );
        specializationRepository.saveAll(specializations);
    }

    private void seedAdmin() {
        User admin = User.builder()
            .email("admin@telehealth.com")
            .password(passwordEncoder.encode("admin123"))
            .firstName("System")
            .lastName("Admin")
            .role(Role.ADMIN)
            .enabled(true)
            .accountNonLocked(true)
            .build();
        userRepository.save(admin);
    }

    private void seedDoctors() {
        // Let's get the seeded specializations
        Specialization cardiology = specializationRepository.findByName("Cardiology").orElse(null);
        Specialization dermatology = specializationRepository.findByName("Dermatology").orElse(null);
        Specialization pediatrics = specializationRepository.findByName("Pediatrics").orElse(null);
        Specialization generalMedicine = specializationRepository.findByName("General Medicine").orElse(null);
        Specialization neurology = specializationRepository.findByName("Neurology").orElse(null);

        // Doctor 1: Cardiology
        createUserAndDoctor(
            "john.doe@telehealth.com",
            "John",
            "Doe",
            "1234567890",
            cardiology,
            "LIC12345",
            "MD - Cardiology, MBBS",
            12,
            new BigDecimal("150.00"),
            "Dr. John Doe is a senior cardiologist with over 12 years of experience in managing cardiac conditions and performing diagnostic procedures.",
            "City Heart Center",
            "123 Cardiac Way, Medical District",
            4.8
        );

        // Doctor 2: Dermatology
        createUserAndDoctor(
            "sarah.smith@telehealth.com",
            "Sarah",
            "Smith",
            "0987654321",
            dermatology,
            "LIC67890",
            "MD - Dermatology, MBBS",
            8,
            new BigDecimal("120.00"),
            "Dr. Sarah Smith specializes in clinical and aesthetic dermatology, helping patients with skin disorders, hair loss, and anti-aging treatments.",
            "Skin & Wellness Clinic",
            "456 Radiance Blvd, Suite 200",
            4.9
        );

        // Doctor 3: Pediatrics
        createUserAndDoctor(
            "emily.davis@telehealth.com",
            "Emily",
            "Davis",
            "5551234567",
            pediatrics,
            "LIC54321",
            "MD - Pediatrics, DCH, MBBS",
            15,
            new BigDecimal("100.00"),
            "Dr. Emily Davis is a compassionate pediatrician dedicated to providing comprehensive healthcare for infants, children, and adolescents.",
            "Happy Kids Clinic",
            "789 Childhood Lane",
            4.7
        );

        // Doctor 4: General Medicine
        createUserAndDoctor(
            "robert.wilson@telehealth.com",
            "Robert",
            "Wilson",
            "4449876543",
            generalMedicine,
            "LIC98765",
            "MD - General Medicine, MBBS",
            10,
            new BigDecimal("80.00"),
            "Dr. Robert Wilson offers primary care services for acute and chronic conditions, emphasizing preventative care and overall well-being.",
            "Family Health Practice",
            "101 Wellness Circle",
            4.6
        );

        // Doctor 5: Neurology
        createUserAndDoctor(
            "william.jones@telehealth.com",
            "William",
            "Jones",
            "3338765432",
            neurology,
            "LIC45678",
            "MD - Neurology, MBBS",
            14,
            new BigDecimal("200.00"),
            "Dr. William Jones is an expert in treating neurological disorders, including migraines, epilepsy, neuropathy, and Parkinson's disease.",
            "Neuroscience Institute",
            "789 Brain Wave Avenue",
            4.9
        );
    }

    private void createUserAndDoctor(String email, String firstName, String lastName, String phone,
                                     Specialization specialization, String licenseNumber, String qualification,
                                     int experienceYears, BigDecimal fee, String bio, String hospitalName,
                                     String hospitalAddress, double rating) {
        User user = User.builder()
            .email(email)
            .password(passwordEncoder.encode("doctor123"))
            .firstName(firstName)
            .lastName(lastName)
            .phone(phone)
            .role(Role.DOCTOR)
            .enabled(true)
            .accountNonLocked(true)
            .build();

        user = userRepository.save(user);

        Doctor doctor = Doctor.builder()
            .user(user)
            .specialization(specialization)
            .licenseNumber(licenseNumber)
            .qualification(qualification)
            .experienceYears(experienceYears)
            .consultationFee(fee)
            .bio(bio)
            .hospitalName(hospitalName)
            .hospitalAddress(hospitalAddress)
            .rating(rating)
            .totalReviews(5)
            .available(true)
            .build();

        doctorRepository.save(doctor);
    }
}

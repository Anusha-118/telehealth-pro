package com.telehealth.pro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class TeleHealthProApplication {
    public static void main(String[] args) {
        SpringApplication.run(TeleHealthProApplication.class, args);
    }
}

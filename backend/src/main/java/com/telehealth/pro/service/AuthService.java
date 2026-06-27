package com.telehealth.pro.service;

import com.telehealth.pro.dto.request.AuthRequest;
import com.telehealth.pro.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(AuthRequest.Register request);
    AuthResponse login(AuthRequest.Login request);
    AuthResponse refreshToken(String refreshToken);
}

package com.backend.service;

import com.backend.dto.auth.LoginRequest;
import com.backend.dto.auth.RegisterRequest;

public interface AuthService {
    String register(RegisterRequest request);
    String login(LoginRequest request);
}

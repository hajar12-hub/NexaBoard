package com.backend.service;

import com.backend.dto.auth.RegisterRequest;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import com.backend.security.JwtService; // Import manquant
import com.backend.service.Impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager; // Import manquant
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService; // AJOUTER CECI pour éviter le NullPointerException

    @Mock
    private AuthenticationManager authenticationManager; // AJOUTER CECI si présent dans le constructeur de AuthServiceImpl

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void shouldRegisterUserSuccessfully() {
        // 1. Given
        RegisterRequest request = new RegisterRequest("hajar", "hajar@test.com", "password123", "member");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        // AJOUTER CECI : On simule le retour du token
        when(jwtService.generateToken(any())).thenReturn("fake-jwt-token");

        // 2. When
        String result = authService.register(request);

        // 3. Then
        assertNotNull(result);
        assertEquals("fake-jwt-token", result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionIfEmailExists() {
        // Given
        RegisterRequest request = new RegisterRequest("hajar", "hajar@test.com", "pwd", "member");
        when(userRepository.existsByEmail("hajar@test.com")).thenReturn(true);

        // When & Then
        assertThrows(RuntimeException.class, () -> authService.register(request));
    }
}
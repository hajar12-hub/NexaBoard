package com.backend.service.Impl;

import com.backend.dto.auth.LoginRequest;
import com.backend.dto.auth.RegisterRequest;
import com.backend.model.User;
import com.backend.model.enums.UserRole;
import com.backend.repository.UserRepository;
import com.backend.security.JwtService;
import com.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé !");
        }


        // Convertir le rôle en format capitalisé pour correspondre à l'enum (member -> Member)
        String roleStr = request.getRole();
        if (roleStr == null || roleStr.isEmpty()) {
            roleStr = "member";
        } else {
            roleStr = roleStr.substring(0, 1).toUpperCase() + roleStr.substring(1).toLowerCase();
        }
        
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // On hache le MDP
                .role(UserRole.valueOf(roleStr))
                .build();


        userRepository.save(user);


        return jwtService.generateToken(user);
    }

    @Override
    public String login(LoginRequest request) {
        // Authentifier l'utilisateur (Spring Security vérifie le MDP automatiquement)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));


        return jwtService.generateToken(user);
    }
}
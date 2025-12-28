package com.backend.service.Impl;

import com.backend.dto.auth.LoginRequest;
import com.backend.dto.auth.RegisterRequest;
import com.backend.dto.auth.UserResponse;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import com.backend.security.JwtService;
import com.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    /**
     * Inscription d'un nouvel utilisateur
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        try {
            // 1. Appeler le service pour créer l'utilisateur et obtenir le token
            String token = authService.register(request);

            // 2. Récupérer l'utilisateur créé pour le renvoyer au frontend
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

            // 3. Créer et ajouter le cookie JWT à la réponse
            ResponseCookie cookie = jwtService.generateJwtCookie(token);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            // 4. Convertir User en UserResponse (sans mot de passe, avec rôle en minuscules)
            UserResponse userResponse = toUserResponse(user);
            return ResponseEntity.ok(userResponse);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Connexion d'un utilisateur existant
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        try {
            // 1. Authentifier et générer le token via le service
            String token = authService.login(request);

            // 2. Récupérer l'utilisateur pour le frontend
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

            // 3. Créer et ajouter le cookie JWT
            ResponseCookie cookie = jwtService.generateJwtCookie(token);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            // 4. Convertir User en UserResponse (sans mot de passe, avec rôle en minuscules)
            UserResponse userResponse = toUserResponse(user);
            return ResponseEntity.ok(userResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou mot de passe incorrect");
        }
    }

    /**
     * Récupérer les infos de l'utilisateur connecté (Utile au refresh F5 de React)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Le principal est l'objet User chargé par UserDetailsService
        User user = (User) authentication.getPrincipal();
        UserResponse userResponse = toUserResponse(user);
        return ResponseEntity.ok(userResponse);
    }

    /**
     * Déconnexion (Suppression du cookie)
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = jwtService.getCleanJwtCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok("Déconnexion réussie");
    }

    /**
     * Convertit un User en UserResponse (sans mot de passe, rôle en minuscules)
     */
    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name().toLowerCase()) // Convertir en minuscules
                .build();
    }
}
package com.backend.controller;

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
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        try {
            // 1. Call the service to create the user and get the token
            String token = authService.register(request);

            // 2. Retrieve the created user to send back to the frontend
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

            // 3. Create and add the JWT cookie to the response
            ResponseCookie cookie = jwtService.generateJwtCookie(token);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            // 4. Convert User to UserResponse (without password, role in lowercase)
            UserResponse userResponse = toUserResponse(user);
            return ResponseEntity.ok(userResponse);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Login an existing user
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        try {
            // 1. Authenticate and generate the token via the service
            String token = authService.login(request);

            // 2. Retrieve the user for the frontend
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

            // 3. Create and add the JWT cookie
            ResponseCookie cookie = jwtService.generateJwtCookie(token);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            // 4. Convert User to UserResponse (without password, role in lowercase)
            UserResponse userResponse = toUserResponse(user);
            return ResponseEntity.ok(userResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect email or password");
        }
    }

    /**
     * Get information about the currently logged-in user
     * (Useful for React page refresh)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // The principal is the User object loaded by UserDetailsService
        User user = (User) authentication.getPrincipal();
        UserResponse userResponse = toUserResponse(user);
        return ResponseEntity.ok(userResponse);
    }

    /**
     * Logout (Delete the cookie)
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = jwtService.getCleanJwtCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok("Logout successful");
    }

    /**
     * Converts a User to UserResponse (without password, role in lowercase)
     */
    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name().toLowerCase()) // convert role to lowercase
                .build();
    }
}

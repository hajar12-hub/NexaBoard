package com.backend.service.Impl;

import com.backend.dto.auth.UserResponse;
import com.backend.model.User;
import com.backend.model.enums.UserRole;
import com.backend.repository.UserRepository;
import com.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name().toLowerCase())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getManagersAndAdmins() {
        List<User> managers = userRepository.findByRole(UserRole.Manager);
        List<User> admins = userRepository.findByRole(UserRole.Admin);
        
        List<User> allManagersAndAdmins = new ArrayList<>(managers);
        allManagersAndAdmins.addAll(admins);
        
        return allManagersAndAdmins.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name().toLowerCase())
                        .build())
                .collect(Collectors.toList());
    }
}

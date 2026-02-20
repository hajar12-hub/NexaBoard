package com.backend.service;

import com.backend.dto.auth.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    List<UserResponse> getManagersAndAdmins();
}

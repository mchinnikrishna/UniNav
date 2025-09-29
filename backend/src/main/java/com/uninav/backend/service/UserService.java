package com.uninav.backend.service;

import com.uninav.backend.model.User;
import com.uninav.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void createUser(User user) {
        userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public boolean saveUserIfNew(String userId, String name, String email, LocalDateTime createdAt, LocalDateTime updatedAt, String profileImage, String phoneNumber, String role, boolean verified) {
        Optional<User> user = getUserById(userId);
        if (user.isPresent()) {
            return false;
        }
        else {
            this.createUser(new User(userId, name, email, profileImage, role, createdAt, updatedAt, phoneNumber, verified));
            return true;
        }
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public User findUserById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public List<String> getUserEmailsByIds(List<String> userIds) {

        if (userIds.isEmpty()) {
            return new ArrayList<>();
        }
        List<String> emails = new ArrayList<>();
        List<User> users = findAllUsers();
        for (User user : users) {
            if(userIds.contains(user.getId())) {
                emails.add(user.getEmail());
            }
        }
        return emails;
    }
}


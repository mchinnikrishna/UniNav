package com.uninav.backend.controller;

import com.uninav.backend.model.User;
import com.uninav.backend.model.UserPreferences;
import com.uninav.backend.service.EmailService;
import com.uninav.backend.service.UserPreferenceService;
import com.uninav.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-preferences")
public class UserPreferencesController {

    @Autowired
    private UserPreferenceService userPreferenceService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserPreferences(@PathVariable("userId") String userId) {
        try {
            Map<String, Object> response = new HashMap<>();
            if (userPreferenceService.getUserPreferences(userId) == null) {
                UserPreferences userPreferences = new UserPreferences(userId, new ArrayList<String>());
                userPreferenceService.setUserPreferences(userPreferences);
                response.put("status", "success");
                response.put("preferences", new ArrayList<String>());
                return ResponseEntity.ok(response);
            }
            List<String> userPreferences = userPreferenceService.getUserPreferences(userId);
            response.put("status", "success");
            response.put("preferences", userPreferences);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("status", "error", "message", "Failed to retrieve user preferences"));
        }
    }

    @PostMapping("/set-preferences/{userId}")
    public ResponseEntity<Map<String, String>> setUserPreferences(@RequestBody List<String> preferredCategories, @PathVariable String userId) {
        try {
            Map<String, String> response = new HashMap<>();
            UserPreferences userPreferences = userPreferenceService.findByUserId(userId);
            userPreferences.setPreferredCategoryIds(preferredCategories);
            userPreferenceService.save(userPreferences);
            emailService.sendPreferencesUpdateNotification(userService.findUserById(userId), preferredCategories);
            response.put("message", "User preferences updated successfully");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to update user preferences"));
        }
    }
}

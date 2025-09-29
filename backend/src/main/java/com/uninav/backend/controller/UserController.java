package com.uninav.backend.controller;

import com.uninav.backend.model.User;
import com.uninav.backend.model.UserVerification;
import com.uninav.backend.service.UserService;
import com.uninav.backend.service.UserVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserVerificationService userVerificationService;

    @PostMapping("/save-user")
    public ResponseEntity<Map<String, Object>> saveUser(@RequestBody Map<String, Object> userData) {
        // Extract user data from the request body
        String userId = (String) userData.get("userId");
        String name = (String) userData.get("name");
        String email = (String) userData.get("email");
        LocalDateTime createdAt = ZonedDateTime.parse((String) userData.get("createdAt")).toLocalDateTime();
        LocalDateTime updatedAt = ZonedDateTime.parse((String) userData.get("updatedAt")).toLocalDateTime();
        String profileImage = (String) userData.get("profileImage");
        String phoneNumber = (String) userData.get("phoneNumber");
        String role = (String) userData.get("role");
        boolean verified = (boolean) userData.get("verified");

        boolean isNewUser = userService.saveUserIfNew(userId, name, email, createdAt, updatedAt, profileImage, phoneNumber, role, verified);

        Map<String, Object> response = new HashMap<>();
        if (isNewUser) {
            response.put("message", "New user saved successfully.");
            response.put("status", "success");
        } else {
            response.put("message", "User already exists.");
            response.put("status", "existing");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/delete-user")
    public ResponseEntity<Map<String, Object>> deleteUser(@RequestParam("userId") String userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/verification-request")
    public ResponseEntity<Map<String, Object>> verificationRequest(@RequestBody UserVerification userVerification) {
        Map<String, Object> response = new HashMap<>();

        try {
            if(userVerificationService.isRequestPresent(userVerification.getUserId())) {
                response.put("status", "request-already-exists");
            }
            else {
                userVerificationService.createUserVerificationRequest(userVerification);
            }
        }
        catch (Exception e) {
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        response.put("status", "success");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/is-request-present")
    public ResponseEntity<Map<String, Object>> isRequestPresent(@RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean isRequestPresent = userVerificationService.isRequestPresent(userId) || userService.getUserById(userId).get().isVerified();
            response.put("isRequestPresent", isRequestPresent);
            response.put("status", "success");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
        catch (Exception e) {
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/get-user-requests")
    public ResponseEntity<List<UserVerification>> getUserRequests() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userVerificationService.getUserVerifications());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @PostMapping("/verify-user")
    public ResponseEntity<Map<String, Object>> verifyUser(@RequestParam String id) {
        Map<String, Object> response = new HashMap<>();

        try{
            UserVerification userVerification = userVerificationService.findById(id);
            if (userVerification != null) {
                User user = userService.getUserById(userVerification.getUserId()).get();
                user.setVerified(true);
                userService.save(user);
                userVerificationService.remove(userVerification);
                response.put("status", "success");
                response.put("message", "User verified successfully.");
            } else {
                response.put("status", "error");
                response.put("message", "User not verified.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<>(
                    Collections.singletonMap("status", "error")
            ));
        }
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/is-verified")
    public ResponseEntity<Map<String, Object>> isUserVerified(@RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean isVerified = userService.getUserById(userId).get().isVerified();
            response.put("status", "success");
            response.put("isVerified", isVerified);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

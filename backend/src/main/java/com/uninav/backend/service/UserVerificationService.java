package com.uninav.backend.service;

import com.uninav.backend.model.User;
import com.uninav.backend.model.UserVerification;
import com.uninav.backend.repository.UserRepository;
import com.uninav.backend.repository.UserVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserVerificationService {

    @Autowired
    private UserVerificationRepository userVerificationRepository;

    @Autowired
    private UserService userService;

    public boolean isRequestPresent(String userId) {
        User user = userService.findUserById(userId);

        if (user == null) return false;
        if(user.isVerified()){
            return true;
        }

        List<UserVerification> userVerifications = userVerificationRepository.findAll();
        for (UserVerification userVerification : userVerifications) {
            if (userVerification.getUserId().equals(userId)) {
                return true;
            }
        }
        return false;
    }

    public List<UserVerification> getUserVerifications() {
        return userVerificationRepository.findAll();
    }

    public void createUserVerificationRequest(UserVerification userVerification) {
        userVerificationRepository.save(userVerification);
    }


    public UserVerification getUserVerificationWithId(String userId) {
        List<UserVerification> userVerifications = userVerificationRepository.findAll();
        for (UserVerification userVerification : userVerifications) {
            if (userVerification.getUserId().equals(userId)) {
                return userVerification;
            }
        }
        return null;
    }

    public void remove(UserVerification userVerification) {
        userVerificationRepository.delete(userVerification);
    }

    public UserVerification findById(String id) {
        return userVerificationRepository.findById(id).get();
    }
}

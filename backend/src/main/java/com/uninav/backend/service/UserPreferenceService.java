package com.uninav.backend.service;

import com.uninav.backend.model.User;
import com.uninav.backend.model.UserPreferences;
import com.uninav.backend.repository.UserPreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserPreferenceService  {

    @Autowired
    UserPreferencesRepository userPreferencesRepository;
    @Autowired
    private UserService userService;

    public List<String> getUserPreferences(String userId) {
        if (userPreferencesRepository.findByUserId(userId) == null) {
            userPreferencesRepository.save(new UserPreferences(userId, new ArrayList<>()));
            return new ArrayList<>();
        }
        return userPreferencesRepository.findByUserId(userId).getPreferredCategoryIds();
    }

    public void setUserPreferences(UserPreferences userPreferences) {
        userPreferencesRepository.save(userPreferences);
    }

    public UserPreferences findByUserId(String userId) {
        return userPreferencesRepository.findByUserId(userId);
    }

    public void save(UserPreferences userPreferences) {
        userPreferencesRepository.save(userPreferences);
    }

    public List<String> getCategorySubscribers(String categoryId) {
        List<User> userList =  userService.findAllUsers();
        List<String> subscribers = new ArrayList<>();
        for (User user : userList) {
            UserPreferences userPreferences = findByUserId(user.getId());
            if (userPreferences != null) {
                List<String> preferredCategoryIds = userPreferences.getPreferredCategoryIds();
                if (!preferredCategoryIds.isEmpty()) {
                    if (preferredCategoryIds.contains(categoryId)) {
                        subscribers.add(user.getEmail());
                    }
                }
            }
        }
        return subscribers;
    }
}

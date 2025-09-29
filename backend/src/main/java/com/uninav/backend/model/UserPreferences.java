package com.uninav.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Document(collection = "user_preferences")
public class UserPreferences {

    @Id
    private String id;
    private String userId;
    private List<String> preferredCategoryIds;

    public UserPreferences(String userId, List<String> preferredCategoryIds) {
        this.userId = userId;
        this.preferredCategoryIds = preferredCategoryIds;
    }
}

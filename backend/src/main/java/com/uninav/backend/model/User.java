package com.uninav.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String profileImage;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String phoneNumber;
    private boolean verified;


    public User(String id, String name, String email, String profileImage, String role, LocalDateTime createdAt, LocalDateTime updatedAt, String phoneNumber, boolean verified) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profileImage = profileImage;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.phoneNumber = phoneNumber;
        this.verified = verified;
    }

}

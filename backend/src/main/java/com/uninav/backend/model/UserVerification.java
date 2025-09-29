package com.uninav.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document( collection = "user_verification")
public class UserVerification {

    @Id
    private String id;

    private String userId;
    private String email;
    private String phone;
    private String name;
    private String verificationDocumentUrl;
    private boolean isBlocked;
}

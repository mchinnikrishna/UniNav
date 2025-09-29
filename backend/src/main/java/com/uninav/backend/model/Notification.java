package com.uninav.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Setter
@Getter
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String subject;
    private String message;
    private LocalDateTime timestamp;
    private boolean read;

    public Notification(String userId, String subject, String message) {
        this.userId = userId;
        this.subject = subject;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.read = false;
    }

}

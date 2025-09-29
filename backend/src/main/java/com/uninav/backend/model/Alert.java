package com.uninav.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "alerts")
public class Alert {
    @Id
    private String id;
    private String title;
    private String description;
    private String what3wordsAddress; // Longitude, Latitude
    private String severity; // High, Medium, Low
    private LocalDateTime expirationDate;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

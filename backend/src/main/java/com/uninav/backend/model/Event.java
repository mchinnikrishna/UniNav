package com.uninav.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String name;
    private String description;
    private String categoryId;
    private String organizerId;
    private String what3wordsAddress;
    private Double latitude;
    private Double longitude;
    private Address address;
    private LocalDateTime date;
    private List<String> attendees;
    private List<String> maybeAttendees;
    private List<String> declinedAttendees;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String type;
    private String duration;
    private Integer likes;
}

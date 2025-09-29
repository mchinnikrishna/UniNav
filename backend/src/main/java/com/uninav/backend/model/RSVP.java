package com.uninav.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Setter
@Getter
@Document(collection = "rsvps")
public class RSVP {
    @Id
    private String id;
    private String userId;
    private String eventId;
    private String status;
    private LocalDateTime rsvpDate;

}


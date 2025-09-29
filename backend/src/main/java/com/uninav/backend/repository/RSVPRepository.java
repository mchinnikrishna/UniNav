package com.uninav.backend.repository;

import com.uninav.backend.model.RSVP;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RSVPRepository extends MongoRepository<RSVP, String> {
    List<RSVP> findByEventId(String eventId);  // Method to get RSVPs for a specific event
    Optional<RSVP> findByUserIdAndEventId(String userId, String eventId);  // Check if a user has already RSVPed
}

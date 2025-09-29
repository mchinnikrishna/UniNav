package com.uninav.backend.repository;

import com.uninav.backend.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByCategoryId(String category);  // Method to find events by category
    List<Event> findByWhat3wordsAddressContainingIgnoreCase(String address);  // Method to search by What3Words address
    List<Event> findEventsByType(String type);
}

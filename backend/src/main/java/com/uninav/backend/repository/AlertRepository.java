package com.uninav.backend.repository;

import com.uninav.backend.model.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends MongoRepository<Alert, String> {
    List<Alert> findBySeverity(String severity);  // Method to get alerts by severity
    List<Alert> findByWhat3wordsAddressContainingIgnoreCase(String address);  // Search alerts by What3Words address
}

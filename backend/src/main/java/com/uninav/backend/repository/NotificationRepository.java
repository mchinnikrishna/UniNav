package com.uninav.backend.repository;

import com.uninav.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    Notification findNotificationById(String userId);

    List<Notification> findByUserIdAndRead(String userId, boolean b);

    List<Notification> findByUserId(String userId);
}


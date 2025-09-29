package com.uninav.backend.controller;

import com.uninav.backend.model.Notification;
import com.uninav.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndRead(userId, false);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        Notification notification = notificationRepository.findById(id)
                .map(n -> {
                    n.setRead(true);
                    return notificationRepository.save(n);
                })
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        return ResponseEntity.ok(notification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String userId) {
        long count = notificationRepository.findByUserIdAndRead(userId, false).size();
        return ResponseEntity.ok(count);
    }
}

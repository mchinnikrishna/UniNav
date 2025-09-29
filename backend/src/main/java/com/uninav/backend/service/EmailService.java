package com.uninav.backend.service;

import com.uninav.backend.model.Event;
import com.uninav.backend.model.User;
import com.uninav.backend.model.Notification;
import com.uninav.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    public void sendEventCreationNotifications(Event event, List<String> categorySubscribers) {
        String subject = "New Event: " + event.getName();
        String htmlTemplate = createEventNotificationTemplate(event);

        if ("Public".equals(event.getType())) {
            categorySubscribers.forEach(user ->
                sendMimeEmail(user, subject, "New event in your subscribed category", htmlTemplate)
            );
        } else if ("Group".equals(event.getType())) {
            event.getAttendees().forEach(attendee ->
                sendMimeEmail(attendee, subject, "You're invited to an event", htmlTemplate)
            );
        }
        sendMimeEmail(userService.getUserById(event.getOrganizerId()).orElseThrow().getEmail(), subject, "Your event is created", htmlTemplate);
    }

    public void sendEventCancellationNotifications(Event event) {
        String subject = "Event Cancelled: " + event.getName();
        String htmlTemplate = createCancellationTemplate(event);

        event.getAttendees().forEach(attendee ->
            sendMimeEmail(attendee, subject, "Event cancelled", htmlTemplate)
        );
        sendMimeEmail(userService.getUserById(event.getOrganizerId()).orElseThrow().getEmail(), subject, "Your event has been cancelled", htmlTemplate);
    }

    public void sendRSVPNotification(Event event, User user, String status) {
        String subject = "Event RSVP Update: " + event.getName();
        String htmlTemplate = createRSVPTemplate(event, user, status);

        sendMimeEmail(userService.getUserById(event.getOrganizerId()).orElseThrow().getEmail(), subject, "RSVP update for your event", htmlTemplate);
        sendMimeEmail(user.getEmail(), subject, "Your RSVP has been recorded", htmlTemplate);
    }

    public void sendPreferencesUpdateNotification(User user, List<String> categories) {
        String subject = "Category Preferences Updated";
        List<String> categoryNames = new ArrayList<>();
        categories.forEach(category -> {
            String categoryName = categoryService.getCategoryById(category).getName();
            categoryNames.add(categoryName);
        });
        String htmlTemplate = createPreferencesTemplate(categoryNames);

        sendMimeEmail(user.getEmail(), subject, "Your preferences have been updated", htmlTemplate);
    }

    private void sendMimeEmail(String to, String subject, String text, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, htmlContent);

            Notification notification = new Notification(to, subject, text);
            notificationRepository.save(notification);

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new RuntimeException("Email sending failed", e);
        }
    }

    private String createEventNotificationTemplate(Event event) {
        return String.format("""
            <div style="font-family: Arial, sans-serif;">
                <h2>New Event: %s</h2>
                <p>%s</p>
                <p>Date: %s</p>
                <p>Location: %s</p>
                <a href="%s" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">View Event</a>
            </div>
            """,
            event.getName(),
            event.getDescription(),
            event.getDate(),
            event.getWhat3wordsAddress(),
            "http://localhost:3000/Uninav/events/" + event.getId()
        );
    }

    private String createCancellationTemplate(Event event) {
        return String.format("""
            <div style="font-family: Arial, sans-serif;">
                <h2>Event Cancelled: %s</h2>
                <p>We regret to inform you that the event has been cancelled.</p>
                <p>Event Details:</p>
                <p>Date: %s</p>
                <p>Location: %s</p>
            </div>
            """,
            event.getName(),
            event.getDate(),
            event.getWhat3wordsAddress()
        );
    }

    private String createRSVPTemplate(Event event, User user, String status) {
        return String.format("""
            <div style="font-family: Arial, sans-serif;">
                <h2>RSVP Update for %s</h2>
                <p>%s has responded: %s</p>
                <p>Event Details:</p>
                <p>Date: %s</p>
                <p>Location: %s</p>
            </div>
            """,
            event.getName(),
            user.getName(),
            status,
            event.getDate(),
            event.getWhat3wordsAddress()
        );
    }

    private String createPreferencesTemplate(List<String> categories) {
        String categoriesList = categories.stream()
            .map(cat -> "<li>" + cat + "</li>")
            .collect(Collectors.joining());

        return String.format("""
            <div style="font-family: Arial, sans-serif;">
                <h2>Your Category Preferences Have Been Updated</h2>
                <p>You will now receive notifications for the following categories:</p>
                <ul>%s</ul>
            </div>
            """,
            categoriesList
        );
    }
}

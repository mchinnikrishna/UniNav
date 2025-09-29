package com.uninav.backend.service;

import com.uninav.backend.model.Event;
import com.uninav.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserService userService;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(String eventId) {
        return eventRepository.findById(eventId);
    }

    public List<Event> getEventsByCategoryId(String category) {
        return eventRepository.findByCategoryId(category);
    }

    public List<Event> searchEventsByWhat3wordsAddress(String address) {
        return eventRepository.findByWhat3wordsAddressContainingIgnoreCase(address);
    }

    public void createEvent(Event event) {
        eventRepository.save(event);
    }

    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }

    public void deleteEvent(String eventId) {
        eventRepository.deleteById(eventId);
    }

    public List<Event> getEventsIsType(String type){
        return eventRepository.findEventsByType(type);
    }


    public void likeEvent(String eventId) {
        eventRepository.findById(eventId).ifPresent(event -> {
            event.setLikes(event.getLikes() + 1);
            eventRepository.save(event);
        });
    }

    public void unlikeEvent(String eventId) {
        eventRepository.findById(eventId).ifPresent(event -> {
            event.setLikes(event.getLikes() - 1);
            eventRepository.save(event);
        });
    }

    public void addAttendeeWithStatus(String eventId, String userId, String status) {
        eventRepository.findById(eventId).ifPresent(event -> {
            if (status.equals("yes")) {
                List<String> attendees = event.getAttendees();
                userService.getUserById(userId).ifPresent(user -> {
                    attendees.add(user.getEmail());
                    event.setAttendees(attendees);
                    eventRepository.save(event);
                });
            } else if (status.equals("no")) {
                List<String> declinedAttendees = event.getDeclinedAttendees();
                userService.getUserById(userId).ifPresent(user -> {
                    declinedAttendees.remove(user.getEmail());
                    event.setAttendees(declinedAttendees);
                    eventRepository.save(event);
                });
            } else {
                List<String> maybeAttendees = event.getMaybeAttendees();
                userService.getUserById(userId).ifPresent(user -> {
                    maybeAttendees.add(user.getEmail());
                    event.setAttendees(maybeAttendees);
                    eventRepository.save(event);
                });
            }
        });
    }

}

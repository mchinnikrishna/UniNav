package com.uninav.backend.service;
import com.uninav.backend.model.RSVP;
import com.uninav.backend.repository.RSVPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RSVPService {

    @Autowired
    private RSVPRepository rsvpRepository;

    public List<RSVP> getRSVPsByEventId(String eventId) {
        return rsvpRepository.findByEventId(eventId);
    }

    public Optional<RSVP> getRSVPByUserIdAndEventId(String userId, String eventId) {
        return rsvpRepository.findByUserIdAndEventId(userId, eventId);
    }

    public RSVP createOrUpdateRSVP(RSVP rsvp) {
        return rsvpRepository.save(rsvp);
    }

    public void deleteRSVP(String rsvpId) {
        rsvpRepository.deleteById(rsvpId);
    }

    public void rsvp(RSVP rsvpData) {
        rsvpData.setRsvpDate(LocalDateTime.now());
        rsvpRepository.save(rsvpData);
    }
}


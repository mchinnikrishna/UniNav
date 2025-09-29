package com.uninav.backend.service;

import com.uninav.backend.model.Alert;
import com.uninav.backend.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public Optional<Alert> getAlertById(String alertId) {
        return alertRepository.findById(alertId);
    }

    public List<Alert> getAlertsBySeverity(String severity) {
        return alertRepository.findBySeverity(severity);
    }

    public List<Alert> searchAlertsByWhat3wordsAddress(String address) {
        return alertRepository.findByWhat3wordsAddressContainingIgnoreCase(address);
    }

    public Alert createAlert(Alert alert) {
        return alertRepository.save(alert);
    }

    public Alert updateAlert(Alert alert) {
        return alertRepository.save(alert);
    }

    public void deleteAlert(String alertId) {
        alertRepository.deleteById(alertId);
    }
}


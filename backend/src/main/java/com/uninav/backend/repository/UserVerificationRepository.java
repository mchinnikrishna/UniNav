package com.uninav.backend.repository;

import com.uninav.backend.model.UserVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserVerificationRepository extends MongoRepository<UserVerification, String> {

    public List<UserVerification> findAll();
}

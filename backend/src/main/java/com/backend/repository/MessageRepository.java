package com.backend.repository;

import com.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findAllByOrderByCreatedAtDesc();
    List<Message> findByProjectIdOrderByCreatedAtDesc(String projectId);
}

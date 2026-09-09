package com.scholaros.homework.repository;

import com.scholaros.homework.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {

    Optional<Topic> findByIdAndActiveTrue(UUID id);

    boolean existsByChapterIdAndTopicNameIgnoreCase(UUID chapterId, String topicName);

    boolean existsByChapterIdAndTopicNameIgnoreCaseAndIdNot(UUID chapterId, String topicName, UUID id);

    Page<Topic> findByActiveTrue(Pageable pageable);

    Page<Topic> findByChapterIdAndActiveTrue(UUID chapterId, Pageable pageable);

    Page<Topic> findByTopicNameContainingIgnoreCaseOrKeywordsContainingIgnoreCaseAndActiveTrue(
            String nameQuery, String keywordQuery, Pageable pageable
    );
}

package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateTopicRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.TopicResponse;
import com.scholaros.homework.dto.UpdateTopicRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TopicService {

    TopicResponse createTopic(CreateTopicRequest request);

    TopicResponse getTopicById(UUID id);

    PageResponse<TopicResponse> getAllTopics(Pageable pageable);

    PageResponse<TopicResponse> getTopicsByChapter(UUID chapterId, Pageable pageable);

    PageResponse<TopicResponse> searchTopics(String query, Pageable pageable);

    TopicResponse updateTopic(UUID id, UpdateTopicRequest request);

    void deleteTopic(UUID id);
}

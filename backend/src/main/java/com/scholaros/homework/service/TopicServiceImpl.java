package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateTopicRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.TopicResponse;
import com.scholaros.homework.dto.UpdateTopicRequest;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.Topic;
import com.scholaros.homework.exception.DuplicateResourceException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.TopicMapper;
import com.scholaros.homework.repository.ChapterRepository;
import com.scholaros.homework.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final ChapterRepository chapterRepository;
    private final TopicMapper topicMapper;

    @Override
    @Transactional
    public TopicResponse createTopic(final CreateTopicRequest request) {
        log.info("Creating topic for chapterId: {}, topicName: {}", request.getChapterId(), request.getTopicName());

        final Chapter chapter = chapterRepository.findByIdAndActiveTrue(request.getChapterId())
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", request.getChapterId()));

        if (topicRepository.existsByChapterIdAndTopicNameIgnoreCase(request.getChapterId(), request.getTopicName())) {
            throw new DuplicateResourceException("Topic with name '" + request.getTopicName() + "' already exists in this chapter");
        }

        final Topic topic = topicMapper.toEntity(request);
        topic.setChapter(chapter);
        if (topic.getActive() == null) {
            topic.setActive(true);
        }

        final Topic saved = topicRepository.save(topic);
        log.info("Topic created successfully with ID: {}", saved.getId());
        return topicMapper.toResponse(saved);
    }

    @Override
    public TopicResponse getTopicById(final UUID id) {
        log.debug("Fetching topic by ID: {}", id);
        final Topic topic = topicRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id));
        return topicMapper.toResponse(topic);
    }

    @Override
    public PageResponse<TopicResponse> getAllTopics(final Pageable pageable) {
        log.debug("Fetching all active topics");
        final Page<TopicResponse> page = topicRepository.findByActiveTrue(pageable)
                .map(topicMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<TopicResponse> getTopicsByChapter(final UUID chapterId, final Pageable pageable) {
        log.debug("Fetching active topics for chapterId: {}", chapterId);
        if (!chapterRepository.existsById(chapterId)) {
            throw new ResourceNotFoundException("Chapter", "id", chapterId);
        }
        final Page<TopicResponse> page = topicRepository.findByChapterIdAndActiveTrue(chapterId, pageable)
                .map(topicMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<TopicResponse> searchTopics(final String query, final Pageable pageable) {
        log.debug("Searching active topics with query: {}", query);
        if (query == null || query.isBlank()) {
            return getAllTopics(pageable);
        }
        final String searchTerm = query.trim();
        final Page<TopicResponse> page = topicRepository
                .findByTopicNameContainingIgnoreCaseOrKeywordsContainingIgnoreCaseAndActiveTrue(searchTerm, searchTerm, pageable)
                .map(topicMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public TopicResponse updateTopic(final UUID id, final UpdateTopicRequest request) {
        log.info("Updating topic with ID: {}", id);
        final Topic topic = topicRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id));

        if (request.getTopicName() != null && !request.getTopicName().isBlank()) {
            if (topicRepository.existsByChapterIdAndTopicNameIgnoreCaseAndIdNot(
                    topic.getChapter().getId(), request.getTopicName(), id)) {
                throw new DuplicateResourceException("Topic with name '" + request.getTopicName() + "' already exists in this chapter");
            }
        }

        topicMapper.updateEntityFromRequest(request, topic);
        final Topic updated = topicRepository.save(topic);
        log.info("Topic updated successfully with ID: {}", updated.getId());
        return topicMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTopic(final UUID id) {
        log.info("Soft deleting topic with ID: {}", id);
        final Topic topic = topicRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id));
        topic.setActive(false);
        topicRepository.save(topic);
        log.info("Topic soft deleted with ID: {}", id);
    }
}

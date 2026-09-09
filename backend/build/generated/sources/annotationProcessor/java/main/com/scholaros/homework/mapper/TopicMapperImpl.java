package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateTopicRequest;
import com.scholaros.homework.dto.TopicResponse;
import com.scholaros.homework.dto.UpdateTopicRequest;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.Topic;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-09T16:13:53+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class TopicMapperImpl implements TopicMapper {

    @Override
    public Topic toEntity(CreateTopicRequest request) {
        if ( request == null ) {
            return null;
        }

        Topic.TopicBuilder topic = Topic.builder();

        topic.topicName( request.getTopicName() );
        topic.learningObjectives( request.getLearningObjectives() );
        topic.keywords( request.getKeywords() );
        topic.estimatedTeachingMinutes( request.getEstimatedTeachingMinutes() );
        topic.difficultyLevel( request.getDifficultyLevel() );
        topic.displayOrder( request.getDisplayOrder() );

        return topic.build();
    }

    @Override
    public TopicResponse toResponse(Topic topic) {
        if ( topic == null ) {
            return null;
        }

        TopicResponse.TopicResponseBuilder topicResponse = TopicResponse.builder();

        topicResponse.chapterId( topicChapterId( topic ) );
        topicResponse.chapterNumber( topicChapterChapterNumber( topic ) );
        topicResponse.chapterTitle( topicChapterTitle( topic ) );
        topicResponse.id( topic.getId() );
        topicResponse.topicName( topic.getTopicName() );
        topicResponse.learningObjectives( topic.getLearningObjectives() );
        topicResponse.keywords( topic.getKeywords() );
        topicResponse.estimatedTeachingMinutes( topic.getEstimatedTeachingMinutes() );
        topicResponse.difficultyLevel( topic.getDifficultyLevel() );
        topicResponse.displayOrder( topic.getDisplayOrder() );
        topicResponse.active( topic.getActive() );
        topicResponse.createdAt( topic.getCreatedAt() );
        topicResponse.updatedAt( topic.getUpdatedAt() );

        return topicResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateTopicRequest request, Topic topic) {
        if ( request == null ) {
            return;
        }

        if ( request.getTopicName() != null ) {
            topic.setTopicName( request.getTopicName() );
        }
        if ( request.getLearningObjectives() != null ) {
            topic.setLearningObjectives( request.getLearningObjectives() );
        }
        if ( request.getKeywords() != null ) {
            topic.setKeywords( request.getKeywords() );
        }
        if ( request.getEstimatedTeachingMinutes() != null ) {
            topic.setEstimatedTeachingMinutes( request.getEstimatedTeachingMinutes() );
        }
        if ( request.getDifficultyLevel() != null ) {
            topic.setDifficultyLevel( request.getDifficultyLevel() );
        }
        if ( request.getDisplayOrder() != null ) {
            topic.setDisplayOrder( request.getDisplayOrder() );
        }
        if ( request.getActive() != null ) {
            topic.setActive( request.getActive() );
        }
    }

    private UUID topicChapterId(Topic topic) {
        Chapter chapter = topic.getChapter();
        if ( chapter == null ) {
            return null;
        }
        return chapter.getId();
    }

    private Integer topicChapterChapterNumber(Topic topic) {
        Chapter chapter = topic.getChapter();
        if ( chapter == null ) {
            return null;
        }
        return chapter.getChapterNumber();
    }

    private String topicChapterTitle(Topic topic) {
        Chapter chapter = topic.getChapter();
        if ( chapter == null ) {
            return null;
        }
        return chapter.getTitle();
    }
}

package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.ChapterResponse;
import com.scholaros.homework.dto.CreateChapterRequest;
import com.scholaros.homework.dto.UpdateChapterRequest;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.Curriculum;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-09T16:13:52+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class ChapterMapperImpl implements ChapterMapper {

    @Override
    public Chapter toEntity(CreateChapterRequest request) {
        if ( request == null ) {
            return null;
        }

        Chapter.ChapterBuilder chapter = Chapter.builder();

        chapter.chapterNumber( request.getChapterNumber() );
        chapter.title( request.getTitle() );
        chapter.description( request.getDescription() );
        chapter.estimatedTeachingHours( request.getEstimatedTeachingHours() );
        chapter.displayOrder( request.getDisplayOrder() );

        return chapter.build();
    }

    @Override
    public ChapterResponse toResponse(Chapter chapter) {
        if ( chapter == null ) {
            return null;
        }

        ChapterResponse.ChapterResponseBuilder chapterResponse = ChapterResponse.builder();

        chapterResponse.curriculumId( chapterCurriculumId( chapter ) );
        chapterResponse.grade( chapterCurriculumGrade( chapter ) );
        chapterResponse.subject( chapterCurriculumSubject( chapter ) );
        chapterResponse.id( chapter.getId() );
        chapterResponse.chapterNumber( chapter.getChapterNumber() );
        chapterResponse.title( chapter.getTitle() );
        chapterResponse.description( chapter.getDescription() );
        chapterResponse.estimatedTeachingHours( chapter.getEstimatedTeachingHours() );
        chapterResponse.displayOrder( chapter.getDisplayOrder() );
        chapterResponse.active( chapter.getActive() );
        chapterResponse.createdAt( chapter.getCreatedAt() );
        chapterResponse.updatedAt( chapter.getUpdatedAt() );

        return chapterResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateChapterRequest request, Chapter chapter) {
        if ( request == null ) {
            return;
        }

        if ( request.getChapterNumber() != null ) {
            chapter.setChapterNumber( request.getChapterNumber() );
        }
        if ( request.getTitle() != null ) {
            chapter.setTitle( request.getTitle() );
        }
        if ( request.getDescription() != null ) {
            chapter.setDescription( request.getDescription() );
        }
        if ( request.getEstimatedTeachingHours() != null ) {
            chapter.setEstimatedTeachingHours( request.getEstimatedTeachingHours() );
        }
        if ( request.getDisplayOrder() != null ) {
            chapter.setDisplayOrder( request.getDisplayOrder() );
        }
        if ( request.getActive() != null ) {
            chapter.setActive( request.getActive() );
        }
    }

    private UUID chapterCurriculumId(Chapter chapter) {
        Curriculum curriculum = chapter.getCurriculum();
        if ( curriculum == null ) {
            return null;
        }
        return curriculum.getId();
    }

    private String chapterCurriculumGrade(Chapter chapter) {
        Curriculum curriculum = chapter.getCurriculum();
        if ( curriculum == null ) {
            return null;
        }
        return curriculum.getGrade();
    }

    private String chapterCurriculumSubject(Chapter chapter) {
        Curriculum curriculum = chapter.getCurriculum();
        if ( curriculum == null ) {
            return null;
        }
        return curriculum.getSubject();
    }
}

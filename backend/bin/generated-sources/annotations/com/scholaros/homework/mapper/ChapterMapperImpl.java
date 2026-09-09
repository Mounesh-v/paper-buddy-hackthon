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
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
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
        chapter.description( request.getDescription() );
        chapter.displayOrder( request.getDisplayOrder() );
        chapter.estimatedTeachingHours( request.getEstimatedTeachingHours() );
        chapter.title( request.getTitle() );

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
        chapterResponse.active( chapter.getActive() );
        chapterResponse.chapterNumber( chapter.getChapterNumber() );
        chapterResponse.createdAt( chapter.getCreatedAt() );
        chapterResponse.description( chapter.getDescription() );
        chapterResponse.displayOrder( chapter.getDisplayOrder() );
        chapterResponse.estimatedTeachingHours( chapter.getEstimatedTeachingHours() );
        chapterResponse.id( chapter.getId() );
        chapterResponse.title( chapter.getTitle() );
        chapterResponse.updatedAt( chapter.getUpdatedAt() );

        return chapterResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateChapterRequest request, Chapter chapter) {
        if ( request == null ) {
            return;
        }

        if ( request.getActive() != null ) {
            chapter.setActive( request.getActive() );
        }
        if ( request.getChapterNumber() != null ) {
            chapter.setChapterNumber( request.getChapterNumber() );
        }
        if ( request.getDescription() != null ) {
            chapter.setDescription( request.getDescription() );
        }
        if ( request.getDisplayOrder() != null ) {
            chapter.setDisplayOrder( request.getDisplayOrder() );
        }
        if ( request.getEstimatedTeachingHours() != null ) {
            chapter.setEstimatedTeachingHours( request.getEstimatedTeachingHours() );
        }
        if ( request.getTitle() != null ) {
            chapter.setTitle( request.getTitle() );
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

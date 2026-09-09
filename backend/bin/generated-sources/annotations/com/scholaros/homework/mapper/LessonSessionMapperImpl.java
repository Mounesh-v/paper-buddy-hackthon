package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateLessonSessionRequest;
import com.scholaros.homework.dto.LessonSessionResponse;
import com.scholaros.homework.dto.LessonSummaryResponse;
import com.scholaros.homework.dto.UpdateLessonSessionRequest;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.Curriculum;
import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.entity.Topic;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:38+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class LessonSessionMapperImpl implements LessonSessionMapper {

    @Override
    public LessonSession toEntity(CreateLessonSessionRequest request) {
        if ( request == null ) {
            return null;
        }

        LessonSession.LessonSessionBuilder lessonSession = LessonSession.builder();

        lessonSession.academicYearId( request.getAcademicYearId() );
        lessonSession.description( request.getDescription() );
        lessonSession.endTime( request.getEndTime() );
        lessonSession.estimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        lessonSession.gradeId( request.getGradeId() );
        lessonSession.lessonDate( request.getLessonDate() );
        lessonSession.lessonTitle( request.getLessonTitle() );
        lessonSession.remarks( request.getRemarks() );
        lessonSession.schoolId( request.getSchoolId() );
        lessonSession.sectionId( request.getSectionId() );
        lessonSession.startTime( request.getStartTime() );
        lessonSession.teacherId( request.getTeacherId() );
        lessonSession.teachingMode( request.getTeachingMode() );

        return lessonSession.build();
    }

    @Override
    public LessonSessionResponse toResponse(LessonSession lessonSession) {
        if ( lessonSession == null ) {
            return null;
        }

        LessonSessionResponse.LessonSessionResponseBuilder lessonSessionResponse = LessonSessionResponse.builder();

        lessonSessionResponse.curriculumId( lessonSessionCurriculumId( lessonSession ) );
        lessonSessionResponse.grade( lessonSessionCurriculumGrade( lessonSession ) );
        lessonSessionResponse.subject( lessonSessionCurriculumSubject( lessonSession ) );
        lessonSessionResponse.chapterId( lessonSessionChapterId( lessonSession ) );
        lessonSessionResponse.chapterNumber( lessonSessionChapterChapterNumber( lessonSession ) );
        lessonSessionResponse.chapterTitle( lessonSessionChapterTitle( lessonSession ) );
        lessonSessionResponse.topicId( lessonSessionTopicId( lessonSession ) );
        lessonSessionResponse.topicName( lessonSessionTopicTopicName( lessonSession ) );
        lessonSessionResponse.academicYearId( lessonSession.getAcademicYearId() );
        lessonSessionResponse.active( lessonSession.getActive() );
        lessonSessionResponse.createdAt( lessonSession.getCreatedAt() );
        lessonSessionResponse.description( lessonSession.getDescription() );
        lessonSessionResponse.endTime( lessonSession.getEndTime() );
        lessonSessionResponse.estimatedDurationMinutes( lessonSession.getEstimatedDurationMinutes() );
        lessonSessionResponse.gradeId( lessonSession.getGradeId() );
        lessonSessionResponse.id( lessonSession.getId() );
        lessonSessionResponse.lessonDate( lessonSession.getLessonDate() );
        lessonSessionResponse.lessonTitle( lessonSession.getLessonTitle() );
        lessonSessionResponse.remarks( lessonSession.getRemarks() );
        lessonSessionResponse.schoolId( lessonSession.getSchoolId() );
        lessonSessionResponse.sectionId( lessonSession.getSectionId() );
        lessonSessionResponse.startTime( lessonSession.getStartTime() );
        lessonSessionResponse.status( lessonSession.getStatus() );
        lessonSessionResponse.teacherId( lessonSession.getTeacherId() );
        lessonSessionResponse.teachingMode( lessonSession.getTeachingMode() );
        lessonSessionResponse.updatedAt( lessonSession.getUpdatedAt() );

        return lessonSessionResponse.build();
    }

    @Override
    public LessonSummaryResponse toSummaryResponse(LessonSession lessonSession) {
        if ( lessonSession == null ) {
            return null;
        }

        LessonSummaryResponse.LessonSummaryResponseBuilder lessonSummaryResponse = LessonSummaryResponse.builder();

        lessonSummaryResponse.chapterTitle( lessonSessionChapterTitle( lessonSession ) );
        lessonSummaryResponse.topicName( lessonSessionTopicTopicName( lessonSession ) );
        lessonSummaryResponse.id( lessonSession.getId() );
        lessonSummaryResponse.lessonDate( lessonSession.getLessonDate() );
        lessonSummaryResponse.lessonTitle( lessonSession.getLessonTitle() );
        lessonSummaryResponse.sectionId( lessonSession.getSectionId() );
        lessonSummaryResponse.status( lessonSession.getStatus() );
        lessonSummaryResponse.teacherId( lessonSession.getTeacherId() );
        lessonSummaryResponse.teachingMode( lessonSession.getTeachingMode() );

        return lessonSummaryResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateLessonSessionRequest request, LessonSession lessonSession) {
        if ( request == null ) {
            return;
        }

        if ( request.getAcademicYearId() != null ) {
            lessonSession.setAcademicYearId( request.getAcademicYearId() );
        }
        if ( request.getActive() != null ) {
            lessonSession.setActive( request.getActive() );
        }
        if ( request.getDescription() != null ) {
            lessonSession.setDescription( request.getDescription() );
        }
        if ( request.getEndTime() != null ) {
            lessonSession.setEndTime( request.getEndTime() );
        }
        if ( request.getEstimatedDurationMinutes() != null ) {
            lessonSession.setEstimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        }
        if ( request.getGradeId() != null ) {
            lessonSession.setGradeId( request.getGradeId() );
        }
        if ( request.getLessonDate() != null ) {
            lessonSession.setLessonDate( request.getLessonDate() );
        }
        if ( request.getLessonTitle() != null ) {
            lessonSession.setLessonTitle( request.getLessonTitle() );
        }
        if ( request.getRemarks() != null ) {
            lessonSession.setRemarks( request.getRemarks() );
        }
        if ( request.getSchoolId() != null ) {
            lessonSession.setSchoolId( request.getSchoolId() );
        }
        if ( request.getSectionId() != null ) {
            lessonSession.setSectionId( request.getSectionId() );
        }
        if ( request.getStartTime() != null ) {
            lessonSession.setStartTime( request.getStartTime() );
        }
        if ( request.getStatus() != null ) {
            lessonSession.setStatus( request.getStatus() );
        }
        if ( request.getTeacherId() != null ) {
            lessonSession.setTeacherId( request.getTeacherId() );
        }
        if ( request.getTeachingMode() != null ) {
            lessonSession.setTeachingMode( request.getTeachingMode() );
        }
    }

    private UUID lessonSessionCurriculumId(LessonSession lessonSession) {
        Curriculum curriculum = lessonSession.getCurriculum();
        if ( curriculum == null ) {
            return null;
        }
        return curriculum.getId();
    }

    private String lessonSessionCurriculumGrade(LessonSession lessonSession) {
        Curriculum curriculum = lessonSession.getCurriculum();
        if ( curriculum == null ) {
            return null;
        }
        return curriculum.getGrade();
    }

    private String lessonSessionCurriculumSubject(LessonSession lessonSession) {
        Curriculum curriculum = lessonSession.getCurriculum();
        if ( curriculum == null ) {
            return null;
        }
        return curriculum.getSubject();
    }

    private UUID lessonSessionChapterId(LessonSession lessonSession) {
        Chapter chapter = lessonSession.getChapter();
        if ( chapter == null ) {
            return null;
        }
        return chapter.getId();
    }

    private Integer lessonSessionChapterChapterNumber(LessonSession lessonSession) {
        Chapter chapter = lessonSession.getChapter();
        if ( chapter == null ) {
            return null;
        }
        return chapter.getChapterNumber();
    }

    private String lessonSessionChapterTitle(LessonSession lessonSession) {
        Chapter chapter = lessonSession.getChapter();
        if ( chapter == null ) {
            return null;
        }
        return chapter.getTitle();
    }

    private UUID lessonSessionTopicId(LessonSession lessonSession) {
        Topic topic = lessonSession.getTopic();
        if ( topic == null ) {
            return null;
        }
        return topic.getId();
    }

    private String lessonSessionTopicTopicName(LessonSession lessonSession) {
        Topic topic = lessonSession.getTopic();
        if ( topic == null ) {
            return null;
        }
        return topic.getTopicName();
    }
}

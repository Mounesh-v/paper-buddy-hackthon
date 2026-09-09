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
    date = "2026-08-31T07:08:58+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-java-compiler-worker-9.5.1.jar, environment: Java 21.0.12 (Eclipse Adoptium)"
)
@Component
public class LessonSessionMapperImpl implements LessonSessionMapper {

    @Override
    public LessonSession toEntity(CreateLessonSessionRequest request) {
        if ( request == null ) {
            return null;
        }

        LessonSession.LessonSessionBuilder lessonSession = LessonSession.builder();

        lessonSession.lessonTitle( request.getLessonTitle() );
        lessonSession.description( request.getDescription() );
        lessonSession.teacherId( request.getTeacherId() );
        lessonSession.schoolId( request.getSchoolId() );
        lessonSession.academicYearId( request.getAcademicYearId() );
        lessonSession.gradeId( request.getGradeId() );
        lessonSession.sectionId( request.getSectionId() );
        lessonSession.lessonDate( request.getLessonDate() );
        lessonSession.startTime( request.getStartTime() );
        lessonSession.endTime( request.getEndTime() );
        lessonSession.estimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        lessonSession.teachingMode( request.getTeachingMode() );
        lessonSession.remarks( request.getRemarks() );

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
        lessonSessionResponse.id( lessonSession.getId() );
        lessonSessionResponse.lessonTitle( lessonSession.getLessonTitle() );
        lessonSessionResponse.description( lessonSession.getDescription() );
        lessonSessionResponse.teacherId( lessonSession.getTeacherId() );
        lessonSessionResponse.schoolId( lessonSession.getSchoolId() );
        lessonSessionResponse.academicYearId( lessonSession.getAcademicYearId() );
        lessonSessionResponse.gradeId( lessonSession.getGradeId() );
        lessonSessionResponse.sectionId( lessonSession.getSectionId() );
        lessonSessionResponse.lessonDate( lessonSession.getLessonDate() );
        lessonSessionResponse.startTime( lessonSession.getStartTime() );
        lessonSessionResponse.endTime( lessonSession.getEndTime() );
        lessonSessionResponse.estimatedDurationMinutes( lessonSession.getEstimatedDurationMinutes() );
        lessonSessionResponse.status( lessonSession.getStatus() );
        lessonSessionResponse.teachingMode( lessonSession.getTeachingMode() );
        lessonSessionResponse.remarks( lessonSession.getRemarks() );
        lessonSessionResponse.active( lessonSession.getActive() );
        lessonSessionResponse.createdAt( lessonSession.getCreatedAt() );
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
        lessonSummaryResponse.lessonTitle( lessonSession.getLessonTitle() );
        lessonSummaryResponse.teacherId( lessonSession.getTeacherId() );
        lessonSummaryResponse.sectionId( lessonSession.getSectionId() );
        lessonSummaryResponse.lessonDate( lessonSession.getLessonDate() );
        lessonSummaryResponse.status( lessonSession.getStatus() );
        lessonSummaryResponse.teachingMode( lessonSession.getTeachingMode() );

        return lessonSummaryResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateLessonSessionRequest request, LessonSession lessonSession) {
        if ( request == null ) {
            return;
        }

        if ( request.getLessonTitle() != null ) {
            lessonSession.setLessonTitle( request.getLessonTitle() );
        }
        if ( request.getDescription() != null ) {
            lessonSession.setDescription( request.getDescription() );
        }
        if ( request.getTeacherId() != null ) {
            lessonSession.setTeacherId( request.getTeacherId() );
        }
        if ( request.getSchoolId() != null ) {
            lessonSession.setSchoolId( request.getSchoolId() );
        }
        if ( request.getAcademicYearId() != null ) {
            lessonSession.setAcademicYearId( request.getAcademicYearId() );
        }
        if ( request.getGradeId() != null ) {
            lessonSession.setGradeId( request.getGradeId() );
        }
        if ( request.getSectionId() != null ) {
            lessonSession.setSectionId( request.getSectionId() );
        }
        if ( request.getLessonDate() != null ) {
            lessonSession.setLessonDate( request.getLessonDate() );
        }
        if ( request.getStartTime() != null ) {
            lessonSession.setStartTime( request.getStartTime() );
        }
        if ( request.getEndTime() != null ) {
            lessonSession.setEndTime( request.getEndTime() );
        }
        if ( request.getEstimatedDurationMinutes() != null ) {
            lessonSession.setEstimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        }
        if ( request.getStatus() != null ) {
            lessonSession.setStatus( request.getStatus() );
        }
        if ( request.getTeachingMode() != null ) {
            lessonSession.setTeachingMode( request.getTeachingMode() );
        }
        if ( request.getRemarks() != null ) {
            lessonSession.setRemarks( request.getRemarks() );
        }
        if ( request.getActive() != null ) {
            lessonSession.setActive( request.getActive() );
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

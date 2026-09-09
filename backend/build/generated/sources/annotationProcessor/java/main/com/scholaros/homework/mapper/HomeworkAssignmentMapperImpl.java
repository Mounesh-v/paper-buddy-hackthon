package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateHomeworkRequest;
import com.scholaros.homework.dto.HomeworkAssignmentResponse;
import com.scholaros.homework.dto.HomeworkQuestionResponse;
import com.scholaros.homework.dto.UpdateHomeworkRequest;
import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkQuestion;
import com.scholaros.homework.entity.HomeworkRecommendation;
import com.scholaros.homework.entity.LessonSession;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-09T16:13:53+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class HomeworkAssignmentMapperImpl implements HomeworkAssignmentMapper {

    @Autowired
    private HomeworkQuestionMapper homeworkQuestionMapper;
    @Autowired
    private HomeworkSubmissionMapper homeworkSubmissionMapper;

    @Override
    public HomeworkAssignment toEntity(CreateHomeworkRequest request) {
        if ( request == null ) {
            return null;
        }

        HomeworkAssignment.HomeworkAssignmentBuilder homeworkAssignment = HomeworkAssignment.builder();

        homeworkAssignment.studentId( request.getStudentId() );
        homeworkAssignment.teacherId( request.getTeacherId() );
        homeworkAssignment.schoolId( request.getSchoolId() );
        homeworkAssignment.sectionId( request.getSectionId() );
        homeworkAssignment.title( request.getTitle() );
        homeworkAssignment.description( request.getDescription() );
        homeworkAssignment.difficultyLevel( request.getDifficultyLevel() );
        homeworkAssignment.estimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        homeworkAssignment.dueDate( request.getDueDate() );

        return homeworkAssignment.build();
    }

    @Override
    public HomeworkAssignmentResponse toResponse(HomeworkAssignment assignment) {
        if ( assignment == null ) {
            return null;
        }

        HomeworkAssignmentResponse.HomeworkAssignmentResponseBuilder homeworkAssignmentResponse = HomeworkAssignmentResponse.builder();

        homeworkAssignmentResponse.lessonSessionId( assignmentLessonSessionId( assignment ) );
        homeworkAssignmentResponse.lessonTitle( assignmentLessonSessionLessonTitle( assignment ) );
        homeworkAssignmentResponse.homeworkRecommendationId( assignmentHomeworkRecommendationId( assignment ) );
        homeworkAssignmentResponse.id( assignment.getId() );
        homeworkAssignmentResponse.studentId( assignment.getStudentId() );
        homeworkAssignmentResponse.teacherId( assignment.getTeacherId() );
        homeworkAssignmentResponse.schoolId( assignment.getSchoolId() );
        homeworkAssignmentResponse.sectionId( assignment.getSectionId() );
        homeworkAssignmentResponse.title( assignment.getTitle() );
        homeworkAssignmentResponse.description( assignment.getDescription() );
        homeworkAssignmentResponse.difficultyLevel( assignment.getDifficultyLevel() );
        homeworkAssignmentResponse.estimatedDurationMinutes( assignment.getEstimatedDurationMinutes() );
        homeworkAssignmentResponse.assignedDate( assignment.getAssignedDate() );
        homeworkAssignmentResponse.dueDate( assignment.getDueDate() );
        homeworkAssignmentResponse.status( assignment.getStatus() );
        homeworkAssignmentResponse.totalQuestions( assignment.getTotalQuestions() );
        homeworkAssignmentResponse.completedQuestions( assignment.getCompletedQuestions() );
        homeworkAssignmentResponse.completionPercentage( assignment.getCompletionPercentage() );
        homeworkAssignmentResponse.generatedByAI( assignment.getGeneratedByAI() );
        homeworkAssignmentResponse.active( assignment.getActive() );
        homeworkAssignmentResponse.questions( homeworkQuestionListToHomeworkQuestionResponseList( assignment.getQuestions() ) );
        homeworkAssignmentResponse.submission( homeworkSubmissionMapper.toResponse( assignment.getSubmission() ) );
        homeworkAssignmentResponse.createdAt( assignment.getCreatedAt() );
        homeworkAssignmentResponse.updatedAt( assignment.getUpdatedAt() );

        return homeworkAssignmentResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateHomeworkRequest request, HomeworkAssignment assignment) {
        if ( request == null ) {
            return;
        }

        if ( request.getTitle() != null ) {
            assignment.setTitle( request.getTitle() );
        }
        if ( request.getDescription() != null ) {
            assignment.setDescription( request.getDescription() );
        }
        if ( request.getDifficultyLevel() != null ) {
            assignment.setDifficultyLevel( request.getDifficultyLevel() );
        }
        if ( request.getEstimatedDurationMinutes() != null ) {
            assignment.setEstimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        }
        if ( request.getDueDate() != null ) {
            assignment.setDueDate( request.getDueDate() );
        }
        if ( request.getStatus() != null ) {
            assignment.setStatus( request.getStatus() );
        }
    }

    private UUID assignmentLessonSessionId(HomeworkAssignment homeworkAssignment) {
        LessonSession lessonSession = homeworkAssignment.getLessonSession();
        if ( lessonSession == null ) {
            return null;
        }
        return lessonSession.getId();
    }

    private String assignmentLessonSessionLessonTitle(HomeworkAssignment homeworkAssignment) {
        LessonSession lessonSession = homeworkAssignment.getLessonSession();
        if ( lessonSession == null ) {
            return null;
        }
        return lessonSession.getLessonTitle();
    }

    private UUID assignmentHomeworkRecommendationId(HomeworkAssignment homeworkAssignment) {
        HomeworkRecommendation homeworkRecommendation = homeworkAssignment.getHomeworkRecommendation();
        if ( homeworkRecommendation == null ) {
            return null;
        }
        return homeworkRecommendation.getId();
    }

    protected List<HomeworkQuestionResponse> homeworkQuestionListToHomeworkQuestionResponseList(List<HomeworkQuestion> list) {
        if ( list == null ) {
            return null;
        }

        List<HomeworkQuestionResponse> list1 = new ArrayList<HomeworkQuestionResponse>( list.size() );
        for ( HomeworkQuestion homeworkQuestion : list ) {
            list1.add( homeworkQuestionMapper.toResponse( homeworkQuestion ) );
        }

        return list1;
    }
}

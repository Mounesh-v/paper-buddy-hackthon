package com.scholaros.homework.service;

import com.scholaros.homework.dto.AssessmentResponse;
import com.scholaros.homework.dto.CreateAssessmentRequest;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.AssessmentType;
import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.entity.LessonStatus;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.AssessmentMapper;
import com.scholaros.homework.repository.AssessmentRepository;
import com.scholaros.homework.repository.LessonSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceTest {

    @Mock
    private AssessmentRepository assessmentRepository;

    @Mock
    private LessonSessionRepository lessonSessionRepository;

    @Mock
    private AssessmentMapper assessmentMapper;

    @InjectMocks
    private AssessmentServiceImpl assessmentService;

    private UUID lessonSessionId;
    private UUID teacherId;
    private LessonSession completedLesson;
    private LessonSession plannedLesson;

    @BeforeEach
    void setUp() {
        lessonSessionId = UUID.randomUUID();
        teacherId = UUID.randomUUID();

        completedLesson = LessonSession.builder()
                .teacherId(teacherId)
                .status(LessonStatus.COMPLETED)
                .lessonTitle("Completed Lesson")
                .build();

        plannedLesson = LessonSession.builder()
                .teacherId(teacherId)
                .status(LessonStatus.PLANNED)
                .lessonTitle("Planned Lesson")
                .build();
    }

    @Test
    @DisplayName("Should create assessment for COMPLETED lesson session")
    void shouldCreateAssessmentForCompletedLesson() {
        final CreateAssessmentRequest request = CreateAssessmentRequest.builder()
                .lessonSessionId(lessonSessionId)
                .title("Pop Quiz 1")
                .assessmentType(AssessmentType.QUIZ)
                .passingMarks(50)
                .estimatedDurationMinutes(30)
                .build();

        final Assessment entity = Assessment.builder()
                .lessonSession(completedLesson)
                .title("Pop Quiz 1")
                .assessmentType(AssessmentType.QUIZ)
                .status(AssessmentStatus.DRAFT)
                .build();

        final AssessmentResponse response = AssessmentResponse.builder()
                .id(UUID.randomUUID())
                .title("Pop Quiz 1")
                .assessmentType(AssessmentType.QUIZ)
                .status(AssessmentStatus.DRAFT)
                .build();

        given(lessonSessionRepository.findByIdAndActiveTrue(lessonSessionId)).willReturn(Optional.of(completedLesson));
        given(assessmentMapper.toEntity(request)).willReturn(entity);
        given(assessmentRepository.save(any(Assessment.class))).willReturn(entity);
        given(assessmentMapper.toResponse(entity)).willReturn(response);

        final AssessmentResponse result = assessmentService.createAssessment(request);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Pop Quiz 1");
        verify(assessmentRepository).save(any(Assessment.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when creating assessment for PLANNED lesson")
    void shouldThrowExceptionForUncompletedLesson() {
        final CreateAssessmentRequest request = CreateAssessmentRequest.builder()
                .lessonSessionId(lessonSessionId)
                .title("Pop Quiz 1")
                .assessmentType(AssessmentType.QUIZ)
                .build();

        given(lessonSessionRepository.findByIdAndActiveTrue(lessonSessionId)).willReturn(Optional.of(plannedLesson));

        assertThatThrownBy(() -> assessmentService.createAssessment(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Assessments can only be created for COMPLETED lesson sessions");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when lesson session not found")
    void shouldThrowExceptionWhenLessonNotFound() {
        final CreateAssessmentRequest request = CreateAssessmentRequest.builder()
                .lessonSessionId(lessonSessionId)
                .title("Pop Quiz 1")
                .assessmentType(AssessmentType.QUIZ)
                .build();

        given(lessonSessionRepository.findByIdAndActiveTrue(lessonSessionId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> assessmentService.createAssessment(request))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

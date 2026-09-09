package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateLessonSessionRequest;
import com.scholaros.homework.dto.LessonSessionResponse;
import com.scholaros.homework.entity.Board;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.Curriculum;
import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.entity.LessonStatus;
import com.scholaros.homework.entity.TeachingMode;
import com.scholaros.homework.entity.Topic;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.LessonSessionMapper;
import com.scholaros.homework.repository.ChapterRepository;
import com.scholaros.homework.repository.CurriculumRepository;
import com.scholaros.homework.repository.LessonSessionRepository;
import com.scholaros.homework.repository.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class LessonSessionServiceTest {

    @Mock
    private LessonSessionRepository lessonSessionRepository;

    @Mock
    private CurriculumRepository curriculumRepository;

    @Mock
    private ChapterRepository chapterRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private LessonSessionMapper lessonSessionMapper;

    @InjectMocks
    private LessonSessionServiceImpl lessonSessionService;

    private UUID curriculumId;
    private UUID chapterId;
    private UUID topicId;
    private UUID teacherId;
    private UUID schoolId;
    private UUID academicYearId;
    private UUID gradeId;
    private UUID sectionId;
    private Curriculum curriculum;
    private Chapter chapter;
    private Topic topic;

    @BeforeEach
    void setUp() {
        curriculumId = UUID.randomUUID();
        chapterId = UUID.randomUUID();
        topicId = UUID.randomUUID();
        teacherId = UUID.randomUUID();
        schoolId = UUID.randomUUID();
        academicYearId = UUID.randomUUID();
        gradeId = UUID.randomUUID();
        sectionId = UUID.randomUUID();

        final Board board = Board.builder().boardName("CBSE").boardCode("CBSE").build();
        curriculum = Curriculum.builder().board(board).grade("Grade 8").subject("Science").build();
        curriculum.setId(curriculumId);

        chapter = Chapter.builder().curriculum(curriculum).chapterNumber(1).title("Chemical Reactions").build();
        chapter.setId(chapterId);

        topic = Topic.builder().chapter(chapter).topicName("Types of Reactions").displayOrder(1).build();
        topic.setId(topicId);
    }

    @Test
    @DisplayName("Should create lesson session successfully")
    void shouldCreateLessonSession() {
        final CreateLessonSessionRequest request = CreateLessonSessionRequest.builder()
                .curriculumId(curriculumId)
                .chapterId(chapterId)
                .topicId(topicId)
                .teacherId(teacherId)
                .schoolId(schoolId)
                .academicYearId(academicYearId)
                .gradeId(gradeId)
                .sectionId(sectionId)
                .lessonTitle("Chemical Reactions Overview")
                .lessonDate(LocalDate.now())
                .teachingMode(TeachingMode.OFFLINE)
                .estimatedDurationMinutes(45)
                .build();

        final LessonSession entity = LessonSession.builder()
                .curriculum(curriculum)
                .chapter(chapter)
                .topic(topic)
                .teacherId(teacherId)
                .schoolId(schoolId)
                .academicYearId(academicYearId)
                .gradeId(gradeId)
                .sectionId(sectionId)
                .lessonTitle("Chemical Reactions Overview")
                .lessonDate(LocalDate.now())
                .teachingMode(TeachingMode.OFFLINE)
                .estimatedDurationMinutes(45)
                .status(LessonStatus.PLANNED)
                .build();

        final LessonSessionResponse response = LessonSessionResponse.builder()
                .id(UUID.randomUUID())
                .lessonTitle("Chemical Reactions Overview")
                .status(LessonStatus.PLANNED)
                .build();

        given(curriculumRepository.findByIdAndActiveTrue(curriculumId)).willReturn(Optional.of(curriculum));
        given(chapterRepository.findByIdAndActiveTrue(chapterId)).willReturn(Optional.of(chapter));
        given(topicRepository.findByIdAndActiveTrue(topicId)).willReturn(Optional.of(topic));
        given(lessonSessionMapper.toEntity(request)).willReturn(entity);
        given(lessonSessionRepository.save(any(LessonSession.class))).willReturn(entity);
        given(lessonSessionMapper.toResponse(entity)).willReturn(response);

        final LessonSessionResponse result = lessonSessionService.createLessonSession(request);

        assertThat(result).isNotNull();
        assertThat(result.getLessonTitle()).isEqualTo("Chemical Reactions Overview");
        verify(lessonSessionRepository).save(any(LessonSession.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when curriculum not found")
    void shouldThrowExceptionWhenCurriculumNotFound() {
        final CreateLessonSessionRequest request = CreateLessonSessionRequest.builder()
                .curriculumId(curriculumId)
                .chapterId(chapterId)
                .topicId(topicId)
                .build();

        given(curriculumRepository.findByIdAndActiveTrue(curriculumId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> lessonSessionService.createLessonSession(request))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

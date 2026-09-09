package com.scholaros.homework;

import com.scholaros.homework.repository.AssessmentAttemptRepository;
import com.scholaros.homework.repository.AssessmentConfigurationRepository;
import com.scholaros.homework.repository.AssessmentRepository;
import com.scholaros.homework.repository.BoardRepository;
import com.scholaros.homework.repository.ChapterRepository;
import com.scholaros.homework.repository.ConceptMasteryRepository;
import com.scholaros.homework.repository.CurriculumRepository;
import com.scholaros.homework.repository.HomeworkAssignmentRepository;
import com.scholaros.homework.repository.HomeworkFeedbackRepository;
import com.scholaros.homework.repository.HomeworkQuestionRepository;
import com.scholaros.homework.repository.HomeworkRecommendationRepository;
import com.scholaros.homework.repository.HomeworkSubmissionRepository;
import com.scholaros.homework.repository.LearningAnalysisRepository;
import com.scholaros.homework.repository.LearningRecordRepository;
import com.scholaros.homework.repository.LessonSessionRepository;
import com.scholaros.homework.repository.QuestionOptionRepository;
import com.scholaros.homework.repository.QuestionRepository;
import com.scholaros.homework.repository.StudentAnswerRepository;
import com.scholaros.homework.repository.TeacherInsightRepository;
import com.scholaros.homework.repository.TopicRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("test")
@EnableAutoConfiguration(exclude = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class,
        FlywayAutoConfiguration.class
})
class ScholarosApplicationTests {

    @MockitoBean
    private BoardRepository boardRepository;

    @MockitoBean
    private CurriculumRepository curriculumRepository;

    @MockitoBean
    private ChapterRepository chapterRepository;

    @MockitoBean
    private TopicRepository topicRepository;

    @MockitoBean
    private LessonSessionRepository lessonSessionRepository;

    @MockitoBean
    private AssessmentRepository assessmentRepository;

    @MockitoBean
    private AssessmentConfigurationRepository assessmentConfigurationRepository;

    @MockitoBean
    private QuestionRepository questionRepository;

    @MockitoBean
    private QuestionOptionRepository questionOptionRepository;

    @MockitoBean
    private AssessmentAttemptRepository assessmentAttemptRepository;

    @MockitoBean
    private StudentAnswerRepository studentAnswerRepository;

    @MockitoBean
    private LearningAnalysisRepository learningAnalysisRepository;

    @MockitoBean
    private HomeworkRecommendationRepository homeworkRecommendationRepository;

    @MockitoBean
    private HomeworkAssignmentRepository homeworkAssignmentRepository;

    @MockitoBean
    private HomeworkQuestionRepository homeworkQuestionRepository;

    @MockitoBean
    private HomeworkSubmissionRepository homeworkSubmissionRepository;

    @MockitoBean
    private HomeworkFeedbackRepository homeworkFeedbackRepository;

    @MockitoBean
    private LearningRecordRepository learningRecordRepository;

    @MockitoBean
    private ConceptMasteryRepository conceptMasteryRepository;

    @MockitoBean
    private TeacherInsightRepository teacherInsightRepository;

    @Test
    void contextLoads() {
    }
}

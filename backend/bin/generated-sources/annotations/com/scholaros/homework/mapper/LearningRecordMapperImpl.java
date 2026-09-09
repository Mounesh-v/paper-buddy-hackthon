package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.ConceptMasteryResponse;
import com.scholaros.homework.dto.LearningRecordResponse;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.ConceptMastery;
import com.scholaros.homework.entity.Curriculum;
import com.scholaros.homework.entity.LearningRecord;
import com.scholaros.homework.entity.Topic;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class LearningRecordMapperImpl implements LearningRecordMapper {

    @Autowired
    private ConceptMasteryMapper conceptMasteryMapper;

    @Override
    public LearningRecordResponse toResponse(LearningRecord record) {
        if ( record == null ) {
            return null;
        }

        LearningRecordResponse.LearningRecordResponseBuilder learningRecordResponse = LearningRecordResponse.builder();

        learningRecordResponse.curriculumId( recordCurriculumId( record ) );
        learningRecordResponse.chapterId( recordChapterId( record ) );
        learningRecordResponse.chapterTitle( recordChapterTitle( record ) );
        learningRecordResponse.topicId( recordTopicId( record ) );
        learningRecordResponse.topicName( recordTopicTopicName( record ) );
        learningRecordResponse.averageAssessmentScore( record.getAverageAssessmentScore() );
        learningRecordResponse.averageCompletionRate( record.getAverageCompletionRate() );
        learningRecordResponse.averageHomeworkScore( record.getAverageHomeworkScore() );
        learningRecordResponse.conceptMasteries( conceptMasteryListToConceptMasteryResponseList( record.getConceptMasteries() ) );
        learningRecordResponse.id( record.getId() );
        learningRecordResponse.lastAssessmentDate( record.getLastAssessmentDate() );
        learningRecordResponse.lastHomeworkDate( record.getLastHomeworkDate() );
        learningRecordResponse.lastUpdated( record.getLastUpdated() );
        learningRecordResponse.overallMasteryPercentage( record.getOverallMasteryPercentage() );
        learningRecordResponse.schoolId( record.getSchoolId() );
        learningRecordResponse.sectionId( record.getSectionId() );
        learningRecordResponse.studentId( record.getStudentId() );
        learningRecordResponse.totalAssessments( record.getTotalAssessments() );
        learningRecordResponse.totalHomework( record.getTotalHomework() );
        learningRecordResponse.totalStudyMinutes( record.getTotalStudyMinutes() );

        return learningRecordResponse.build();
    }

    private UUID recordCurriculumId(LearningRecord learningRecord) {
        Curriculum curriculum = learningRecord.getCurriculum();
        if ( curriculum == null ) {
            return null;
        }
        return curriculum.getId();
    }

    private UUID recordChapterId(LearningRecord learningRecord) {
        Chapter chapter = learningRecord.getChapter();
        if ( chapter == null ) {
            return null;
        }
        return chapter.getId();
    }

    private String recordChapterTitle(LearningRecord learningRecord) {
        Chapter chapter = learningRecord.getChapter();
        if ( chapter == null ) {
            return null;
        }
        return chapter.getTitle();
    }

    private UUID recordTopicId(LearningRecord learningRecord) {
        Topic topic = learningRecord.getTopic();
        if ( topic == null ) {
            return null;
        }
        return topic.getId();
    }

    private String recordTopicTopicName(LearningRecord learningRecord) {
        Topic topic = learningRecord.getTopic();
        if ( topic == null ) {
            return null;
        }
        return topic.getTopicName();
    }

    protected List<ConceptMasteryResponse> conceptMasteryListToConceptMasteryResponseList(List<ConceptMastery> list) {
        if ( list == null ) {
            return null;
        }

        List<ConceptMasteryResponse> list1 = new ArrayList<ConceptMasteryResponse>( list.size() );
        for ( ConceptMastery conceptMastery : list ) {
            list1.add( conceptMasteryMapper.toResponse( conceptMastery ) );
        }

        return list1;
    }
}

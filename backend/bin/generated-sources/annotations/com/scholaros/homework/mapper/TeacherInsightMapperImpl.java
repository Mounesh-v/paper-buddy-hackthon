package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.TeacherInsightResponse;
import com.scholaros.homework.entity.Curriculum;
import com.scholaros.homework.entity.TeacherInsight;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class TeacherInsightMapperImpl extends TeacherInsightMapper {

    @Override
    public TeacherInsightResponse toResponse(TeacherInsight insight) {
        if ( insight == null ) {
            return null;
        }

        TeacherInsightResponse.TeacherInsightResponseBuilder teacherInsightResponse = TeacherInsightResponse.builder();

        teacherInsightResponse.curriculumId( insightCurriculumId( insight ) );
        teacherInsightResponse.strongTopics( jsonToList( insight.getStrongTopics() ) );
        teacherInsightResponse.weakTopics( jsonToList( insight.getWeakTopics() ) );
        teacherInsightResponse.recommendedRevisionTopics( jsonToList( insight.getRecommendedRevisionTopics() ) );
        teacherInsightResponse.generatedAt( insight.getGeneratedAt() );
        teacherInsightResponse.id( insight.getId() );
        teacherInsightResponse.schoolId( insight.getSchoolId() );
        teacherInsightResponse.sectionId( insight.getSectionId() );
        teacherInsightResponse.summary( insight.getSummary() );
        teacherInsightResponse.teacherId( insight.getTeacherId() );

        return teacherInsightResponse.build();
    }

    private UUID insightCurriculumId(TeacherInsight teacherInsight) {
        Curriculum curriculum = teacherInsight.getCurriculum();
        if ( curriculum == null ) {
            return null;
        }
        return curriculum.getId();
    }
}

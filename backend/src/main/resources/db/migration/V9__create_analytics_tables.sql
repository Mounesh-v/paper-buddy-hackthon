-- Migration V9: Create Learning Analytics & Insights Tables

CREATE TABLE learning_records (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL,
    school_id UUID NOT NULL,
    section_id UUID NOT NULL,
    curriculum_id UUID NOT NULL,
    chapter_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    overall_mastery_percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    average_assessment_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    average_homework_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    average_completion_rate DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    total_assessments INT NOT NULL DEFAULT 0,
    total_homework INT NOT NULL DEFAULT 0,
    total_study_minutes INT NOT NULL DEFAULT 0,
    last_assessment_date TIMESTAMP,
    last_homework_date TIMESTAMP,
    last_updated TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_records_curriculum FOREIGN KEY (curriculum_id) REFERENCES curricula(id),
    CONSTRAINT fk_records_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id),
    CONSTRAINT fk_records_topic FOREIGN KEY (topic_id) REFERENCES topics(id),
    CONSTRAINT uk_student_topic UNIQUE (student_id, topic_id)
);

CREATE TABLE concept_masteries (
    id UUID PRIMARY KEY,
    learning_record_id UUID NOT NULL,
    concept_name VARCHAR(200) NOT NULL,
    mastery_level VARCHAR(30) NOT NULL DEFAULT 'DEVELOPING',
    mastery_percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    attempt_count INT NOT NULL DEFAULT 1,
    improvement_percentage DOUBLE PRECISION DEFAULT 0.0,
    last_practiced TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_concepts_record FOREIGN KEY (learning_record_id) REFERENCES learning_records(id) ON DELETE CASCADE
);

CREATE TABLE teacher_insights (
    id UUID PRIMARY KEY,
    teacher_id UUID NOT NULL,
    school_id UUID NOT NULL,
    section_id UUID NOT NULL,
    curriculum_id UUID,
    summary TEXT,
    strong_topics TEXT,
    weak_topics TEXT,
    recommended_revision_topics TEXT,
    generated_at TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_insights_curriculum FOREIGN KEY (curriculum_id) REFERENCES curricula(id)
);

CREATE INDEX idx_records_student_id ON learning_records(student_id);
CREATE INDEX idx_records_section_id ON learning_records(section_id);
CREATE INDEX idx_records_topic_id ON learning_records(topic_id);
CREATE INDEX idx_concepts_record_id ON concept_masteries(learning_record_id);
CREATE INDEX idx_concepts_level ON concept_masteries(mastery_level);
CREATE INDEX idx_insights_teacher_id ON teacher_insights(teacher_id);
CREATE INDEX idx_insights_section_id ON teacher_insights(section_id);

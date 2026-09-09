-- Migration V4: Create Lesson Sessions Table

CREATE TABLE lesson_sessions (
    id UUID PRIMARY KEY,
    lesson_title VARCHAR(200) NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL,
    school_id UUID NOT NULL,
    academic_year_id UUID,
    grade_id UUID,
    section_id UUID NOT NULL,
    curriculum_id UUID NOT NULL,
    chapter_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    lesson_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    estimated_duration_minutes INT,
    status VARCHAR(30) NOT NULL DEFAULT 'PLANNED',
    teaching_mode VARCHAR(30) NOT NULL DEFAULT 'OFFLINE',
    remarks TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_lessons_curriculum FOREIGN KEY (curriculum_id) REFERENCES curricula(id),
    CONSTRAINT fk_lessons_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id),
    CONSTRAINT fk_lessons_topic FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE INDEX idx_lessons_teacher_id ON lesson_sessions(teacher_id);
CREATE INDEX idx_lessons_school_id ON lesson_sessions(school_id);
CREATE INDEX idx_lessons_section_id ON lesson_sessions(section_id);
CREATE INDEX idx_lessons_topic_id ON lesson_sessions(topic_id);
CREATE INDEX idx_lessons_lesson_date ON lesson_sessions(lesson_date);
CREATE INDEX idx_lessons_status ON lesson_sessions(status);

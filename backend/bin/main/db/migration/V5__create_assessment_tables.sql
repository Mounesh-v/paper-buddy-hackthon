-- Migration V5: Create Assessment Management Tables

CREATE TABLE assessments (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    lesson_session_id UUID NOT NULL,
    assessment_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    instructions TEXT,
    total_marks INT NOT NULL DEFAULT 0,
    passing_marks INT,
    estimated_duration_minutes INT,
    available_from TIMESTAMP,
    available_until TIMESTAMP,
    allow_multiple_attempts BOOLEAN NOT NULL DEFAULT false,
    show_correct_answers BOOLEAN NOT NULL DEFAULT true,
    shuffle_questions BOOLEAN NOT NULL DEFAULT false,
    shuffle_options BOOLEAN NOT NULL DEFAULT false,
    negative_marking_enabled BOOLEAN NOT NULL DEFAULT false,
    negative_marks_per_question DOUBLE PRECISION DEFAULT 0.0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_assessments_lesson_session FOREIGN KEY (lesson_session_id) REFERENCES lesson_sessions(id)
);

CREATE TABLE assessment_configurations (
    id UUID PRIMARY KEY,
    assessment_id UUID NOT NULL UNIQUE,
    max_attempts INT NOT NULL DEFAULT 1,
    auto_submit BOOLEAN NOT NULL DEFAULT true,
    randomize_questions BOOLEAN NOT NULL DEFAULT false,
    randomize_options BOOLEAN NOT NULL DEFAULT false,
    display_result_immediately BOOLEAN NOT NULL DEFAULT true,
    allow_review_after_submission BOOLEAN NOT NULL DEFAULT true,
    allow_skip_questions BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_config_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id UUID PRIMARY KEY,
    assessment_id UUID NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL,
    difficulty_level VARCHAR(30),
    marks INT NOT NULL DEFAULT 1,
    negative_marks DOUBLE PRECISION DEFAULT 0.0,
    explanation TEXT,
    display_order INT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_questions_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE question_options (
    id UUID PRIMARY KEY,
    question_id UUID NOT NULL,
    option_text TEXT NOT NULL,
    correct BOOLEAN NOT NULL DEFAULT false,
    display_order INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_options_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_assessments_lesson_session_id ON assessments(lesson_session_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_questions_assessment_id ON questions(assessment_id);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_options_question_id ON question_options(question_id);

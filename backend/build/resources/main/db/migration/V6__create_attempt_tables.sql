-- Migration V6: Create Assessment Attempt & Student Answer Tables

CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY,
    assessment_id UUID NOT NULL,
    student_id UUID NOT NULL,
    school_id UUID NOT NULL,
    section_id UUID NOT NULL,
    started_at TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP,
    time_taken_seconds INT,
    attempt_number INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',
    score DOUBLE PRECISION DEFAULT 0.0,
    maximum_score DOUBLE PRECISION DEFAULT 0.0,
    percentage DOUBLE PRECISION DEFAULT 0.0,
    passed BOOLEAN,
    auto_submitted BOOLEAN NOT NULL DEFAULT false,
    evaluation_completed BOOLEAN NOT NULL DEFAULT false,
    remarks TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_attempts_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

CREATE TABLE student_answers (
    id UUID PRIMARY KEY,
    attempt_id UUID NOT NULL,
    question_id UUID NOT NULL,
    selected_option_id UUID,
    answer_text TEXT,
    correct BOOLEAN,
    marks_awarded DOUBLE PRECISION DEFAULT 0.0,
    time_spent_seconds INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_answers_attempt FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES questions(id),
    CONSTRAINT uk_attempt_question UNIQUE (attempt_id, question_id)
);

CREATE INDEX idx_attempts_student_id ON assessment_attempts(student_id);
CREATE INDEX idx_attempts_assessment_id ON assessment_attempts(assessment_id);
CREATE INDEX idx_attempts_status ON assessment_attempts(status);
CREATE INDEX idx_attempts_submitted_at ON assessment_attempts(submitted_at);
CREATE INDEX idx_answers_attempt_id ON student_answers(attempt_id);

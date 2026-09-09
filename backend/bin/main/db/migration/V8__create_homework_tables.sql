-- Migration V8: Create Homework Management Tables

CREATE TABLE homework_assignments (
    id UUID PRIMARY KEY,
    lesson_session_id UUID NOT NULL,
    homework_recommendation_id UUID NOT NULL UNIQUE,
    student_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    school_id UUID NOT NULL,
    section_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(30),
    estimated_duration_minutes INT NOT NULL DEFAULT 15,
    assigned_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ASSIGNED',
    total_questions INT NOT NULL DEFAULT 0,
    completed_questions INT NOT NULL DEFAULT 0,
    completion_percentage DOUBLE PRECISION DEFAULT 0.0,
    generated_by_ai BOOLEAN NOT NULL DEFAULT true,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_homework_lesson_session FOREIGN KEY (lesson_session_id) REFERENCES lesson_sessions(id),
    CONSTRAINT fk_homework_recommendation FOREIGN KEY (homework_recommendation_id) REFERENCES homework_recommendations(id)
);

CREATE TABLE homework_questions (
    id UUID PRIMARY KEY,
    homework_assignment_id UUID NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL,
    difficulty_level VARCHAR(30),
    marks INT NOT NULL DEFAULT 1,
    correct_answer TEXT,
    explanation TEXT,
    display_order INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_questions_homework FOREIGN KEY (homework_assignment_id) REFERENCES homework_assignments(id) ON DELETE CASCADE
);

CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY,
    homework_assignment_id UUID NOT NULL UNIQUE,
    submitted_at TIMESTAMP NOT NULL,
    time_taken_minutes INT,
    score DOUBLE PRECISION DEFAULT 0.0,
    maximum_score DOUBLE PRECISION DEFAULT 0.0,
    percentage DOUBLE PRECISION DEFAULT 0.0,
    submitted BOOLEAN NOT NULL DEFAULT true,
    late_submission BOOLEAN NOT NULL DEFAULT false,
    auto_evaluated BOOLEAN NOT NULL DEFAULT true,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_submissions_homework FOREIGN KEY (homework_assignment_id) REFERENCES homework_assignments(id) ON DELETE CASCADE
);

CREATE TABLE homework_feedbacks (
    id UUID PRIMARY KEY,
    homework_submission_id UUID NOT NULL UNIQUE,
    feedback_summary TEXT,
    strengths TEXT,
    weaknesses TEXT,
    next_steps TEXT,
    teacher_remarks TEXT,
    source VARCHAR(30) NOT NULL DEFAULT 'AI',
    generated_by_ai BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_feedbacks_submission FOREIGN KEY (homework_submission_id) REFERENCES homework_submissions(id) ON DELETE CASCADE
);

CREATE INDEX idx_homework_student_id ON homework_assignments(student_id);
CREATE INDEX idx_homework_teacher_id ON homework_assignments(teacher_id);
CREATE INDEX idx_homework_lesson_session_id ON homework_assignments(lesson_session_id);
CREATE INDEX idx_homework_status ON homework_assignments(status);
CREATE INDEX idx_homework_due_date ON homework_assignments(due_date);

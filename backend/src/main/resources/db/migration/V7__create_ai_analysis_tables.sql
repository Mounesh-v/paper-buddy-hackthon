-- Migration V7: Create Learning Analysis & Homework Recommendation Tables

CREATE TABLE learning_analyses (
    id UUID PRIMARY KEY,
    assessment_attempt_id UUID NOT NULL UNIQUE,
    overall_mastery_percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    mastery_level VARCHAR(30) NOT NULL,
    strong_concepts TEXT,
    weak_concepts TEXT,
    misconceptions TEXT,
    confidence_score DOUBLE PRECISION DEFAULT 0.0,
    recommended_difficulty VARCHAR(30),
    recommended_study_minutes INT,
    analysis_summary TEXT,
    ai_model VARCHAR(100),
    analysis_timestamp TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_analyses_attempt FOREIGN KEY (assessment_attempt_id) REFERENCES assessment_attempts(id)
);

CREATE TABLE homework_recommendations (
    id UUID PRIMARY KEY,
    learning_analysis_id UUID NOT NULL UNIQUE,
    recommended_difficulty VARCHAR(30),
    recommended_question_count INT NOT NULL DEFAULT 5,
    recommended_practice_minutes INT NOT NULL DEFAULT 15,
    recommended_topics TEXT,
    recommended_question_types TEXT,
    priority_level VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',
    recommendation_reason TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_recommendations_analysis FOREIGN KEY (learning_analysis_id) REFERENCES learning_analyses(id) ON DELETE CASCADE
);

CREATE INDEX idx_analyses_attempt_id ON learning_analyses(assessment_attempt_id);
CREATE INDEX idx_recommendations_analysis_id ON homework_recommendations(learning_analysis_id);

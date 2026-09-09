-- Migration V2: Create Curriculum & Content Management Tables

CREATE TABLE boards (
    id UUID PRIMARY KEY,
    board_name VARCHAR(100) NOT NULL,
    board_code VARCHAR(20) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_boards_board_code UNIQUE (board_code)
);

CREATE TABLE curricula (
    id UUID PRIMARY KEY,
    board_id UUID NOT NULL,
    grade VARCHAR(50) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_curricula_board FOREIGN KEY (board_id) REFERENCES boards(id),
    CONSTRAINT uk_curricula_board_grade_subject UNIQUE (board_id, grade, subject)
);

CREATE TABLE chapters (
    id UUID PRIMARY KEY,
    curriculum_id UUID NOT NULL,
    chapter_number INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    estimated_teaching_hours INT,
    display_order INT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_chapters_curriculum FOREIGN KEY (curriculum_id) REFERENCES curricula(id),
    CONSTRAINT uk_chapters_curriculum_number UNIQUE (curriculum_id, chapter_number)
);

CREATE TABLE topics (
    id UUID PRIMARY KEY,
    chapter_id UUID NOT NULL,
    topic_name VARCHAR(200) NOT NULL,
    learning_objectives TEXT,
    keywords TEXT,
    estimated_teaching_minutes INT,
    difficulty_level VARCHAR(30),
    display_order INT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_topics_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id),
    CONSTRAINT uk_topics_chapter_name UNIQUE (chapter_id, topic_name)
);

CREATE INDEX idx_boards_code ON boards(board_code);
CREATE INDEX idx_curricula_board_id ON curricula(board_id);
CREATE INDEX idx_chapters_curriculum_id ON chapters(curriculum_id);
CREATE INDEX idx_topics_chapter_id ON topics(chapter_id);

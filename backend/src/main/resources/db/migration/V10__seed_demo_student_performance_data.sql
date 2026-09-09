-- Migration V10: Seed Demo Student Performance Data

-- 1. Seed Sample Lesson Sessions
INSERT INTO lesson_sessions (
    id, lesson_title, description, teacher_id, school_id, section_id, curriculum_id, chapter_id, topic_id, lesson_date, status, teaching_mode, active, created_at, updated_at
) VALUES 
('11000000-0000-0000-0000-000000000001', 'Chemical Equations & Balancing Session', 'Introduction to balancing chemical equations conserving mass', '22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '40404040-9c0b-4ef8-bb6d-6bb9bd380d01', '44444444-9c0b-4ef8-bb6d-6bb9bd380d01', '2026-08-30', 'COMPLETED', 'OFFLINE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11000000-0000-0000-0000-000000000002', 'Linear Equations in One Variable Session', 'Solving algebraic equations step-by-step', '22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '20202020-9c0b-4ef8-bb6d-6bb9bd380b02', '22222222-9c0b-4ef8-bb6d-6bb9bd380b02', '2026-08-25', 'COMPLETED', 'OFFLINE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11000000-0000-0000-0000-000000000003', 'Microorganisms Classification Session', 'Exploring bacteria, fungi, algae and viruses', '22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10101010-9c0b-4ef8-bb6d-6bb9bd380a02', '11111111-9c0b-4ef8-bb6d-6bb9bd380a03', '2026-08-18', 'COMPLETED', 'OFFLINE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Seed Sample Assessments
INSERT INTO assessments (
    id, title, description, lesson_session_id, assessment_type, status, total_marks, passing_marks, estimated_duration_minutes, active, created_at, updated_at
) VALUES
('22000000-0000-0000-0000-000000000001', 'Chemical Reactions & Balancing Quiz', 'Evaluation of stoichiometry and equation balancing', '11000000-0000-0000-0000-000000000001', 'QUIZ', 'PUBLISHED', 50, 20, 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22000000-0000-0000-0000-000000000002', 'Linear Equations Mastery Test', 'Comprehensive test on single-variable linear equations', '11000000-0000-0000-0000-000000000002', 'QUIZ', 'PUBLISHED', 50, 20, 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22000000-0000-0000-0000-000000000003', 'Microorganisms & Pathogens Assessment', 'Assessment on useful and harmful microbes', '11000000-0000-0000-0000-000000000003', 'QUIZ', 'PUBLISHED', 50, 20, 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Seed Assessment Attempts for Student Alex (33333333-3333-3333-3333-333333333333)
INSERT INTO assessment_attempts (
    id, assessment_id, student_id, school_id, section_id, started_at, submitted_at, time_taken_seconds, attempt_number, status, score, maximum_score, percentage, passed, evaluation_completed, active, created_at, updated_at
) VALUES
('33000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', '2026-09-04 10:00:00', '2026-09-04 10:24:00', 1440, 1, 'GRADED', 47.0, 50.0, 94.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('33000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', '2026-08-29 11:00:00', '2026-08-29 11:22:00', 1320, 1, 'GRADED', 44.0, 50.0, 88.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('33000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', '2026-08-22 14:00:00', '2026-08-22 14:26:00', 1560, 1, 'GRADED', 41.0, 50.0, 82.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


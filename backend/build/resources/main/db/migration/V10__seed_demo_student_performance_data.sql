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

-- 4. Seed Homework Assignments & Submissions
INSERT INTO homework_assignments (
    id, title, description, lesson_session_id, teacher_id, student_id, school_id, section_id, due_date, status, active, created_at, updated_at
) VALUES
('44000000-0000-0000-0000-000000000001', 'Balancing Chemical Equations Worksheet', 'Solve 10 chemical balancing problems with state symbols', '11000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', '2026-09-06 23:59:59', 'GRADED', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('44000000-0000-0000-0000-000000000002', 'Linear Equations Word Problems Set', 'Practice word problems converted to single variable equations', '11000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', '2026-09-01 23:59:59', 'GRADED', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('44000000-0000-0000-0000-000000000003', 'Fermentation & Microbes Lab Report', 'Write observations on yeast fermentation rates', '11000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', '2026-08-25 23:59:59', 'GRADED', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO homework_submissions (
    id, homework_assignment_id, student_id, submission_text, score, maximum_score, percentage, evaluation_status, submitted_at, active, created_at, updated_at
) VALUES
('55000000-0000-0000-0000-000000000001', '44000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Completed chemical balancing worksheet with all steps.', 92.0, 100.0, 92.0, 'GRADED', '2026-09-05 18:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('55000000-0000-0000-0000-000000000002', '44000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Linear algebra solutions attached.', 88.0, 100.0, 88.0, 'GRADED', '2026-08-31 16:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('55000000-0000-0000-0000-000000000003', '44000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Fermentation observation data and charts.', 85.0, 100.0, 85.0, 'GRADED', '2026-08-24 20:15:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5. Seed Learning Records & Concept Masteries
INSERT INTO learning_records (
    id, student_id, school_id, section_id, curriculum_id, chapter_id, topic_id, overall_mastery_percentage, average_assessment_score, average_homework_score, average_completion_rate, total_assessments, total_homework, total_study_minutes, last_updated, active, created_at, updated_at
) VALUES
('66000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '40404040-9c0b-4ef8-bb6d-6bb9bd380d01', '44444444-9c0b-4ef8-bb6d-6bb9bd380d01', 93.2, 94.0, 92.0, 100.0, 2, 2, 120, CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('66000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '20202020-9c0b-4ef8-bb6d-6bb9bd380b02', '22222222-9c0b-4ef8-bb6d-6bb9bd380b02', 88.0, 88.0, 88.0, 100.0, 1, 1, 95, CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('66000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10101010-9c0b-4ef8-bb6d-6bb9bd380a02', '11111111-9c0b-4ef8-bb6d-6bb9bd380a03', 83.5, 82.0, 85.0, 100.0, 1, 1, 80, CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO concept_masteries (
    id, learning_record_id, concept_name, mastery_level, mastery_percentage, attempt_count, improvement_percentage, last_practiced, created_at, updated_at
) VALUES
('77000000-0000-0000-0000-000000000001', '66000000-0000-0000-0000-000000000001', 'Chemical Equations & Balancing', 'MASTERED', 94.0, 3, 12.0, '2026-09-04 10:24:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77000000-0000-0000-0000-000000000002', '66000000-0000-0000-0000-000000000002', 'Solving Equations with Variables on Both Sides', 'MASTERED', 90.0, 4, 8.5, '2026-09-02 15:10:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77000000-0000-0000-0000-000000000003', '77000000-0000-0000-0000-000000000001', 'Types of Chemical Reactions', 'PROFICIENT', 86.0, 2, 6.0, '2026-09-01 11:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77000000-0000-0000-0000-000000000004', '66000000-0000-0000-0000-000000000003', 'Friendly Microorganisms & Fermentation', 'PROFICIENT', 85.0, 2, 5.0, '2026-08-28 09:45:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77000000-0000-0000-0000-000000000005', '66000000-0000-0000-0000-000000000002', 'Properties of Rational Numbers', 'PROFICIENT', 78.0, 3, 3.2, '2026-08-24 16:20:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77000000-0000-0000-0000-000000000006', '66000000-0000-0000-0000-000000000003', 'Microorganism Pathogens & Diseases', 'DEVELOPING', 72.0, 2, 1.5, '2026-08-20 13:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77000000-0000-0000-0000-000000000007', '66000000-0000-0000-0000-000000000001', 'Redox & Displacement Reactions', 'AT_RISK', 48.0, 2, -4.0, '2026-08-15 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77000000-0000-0000-0000-000000000008', '66000000-0000-0000-0000-000000000003', 'Synthetic Fibres & Polymer Impact', 'CRITICAL', 32.0, 1, -8.0, '2026-08-10 14:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Seed AI Diagnostic Analysis Record for attempt 33000000-0000-0000-0000-000000000001
INSERT INTO ai_learning_analyses (
    id, attempt_id, student_id, school_id, section_id, overall_mastery_percentage, analysis_summary, strong_concepts, weak_concepts, recommended_actions, raw_gemini_response, active, created_at, updated_at
) VALUES
('88000000-0000-0000-0000-000000000001', '33000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f8e7d6c5-b4a3-2109-8765-43210fedcba9', 94.0, 'Student demonstrated exceptional mastery in balancing combination and decomposition chemical equations. Outstanding speed and accuracy on stoichiometry.', 'Balancing Chemical Equations, Conservation of Mass, Reactants & Products', 'Redox Reactions, Oxidation State Determination', 'Practice 3 targeted questions on oxidation numbers and single displacement reactions.', 'Gemini AI Evaluation: High proficiency in stoichiometric equations.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

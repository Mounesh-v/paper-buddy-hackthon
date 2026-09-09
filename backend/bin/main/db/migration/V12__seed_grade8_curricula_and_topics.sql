-- Migration V12: Seed Grade 8 Social Science and Complete Topic Mappings for Grade 8, 9, and 10 Curricula

-- 1. Curricula (Grade 8 Social Science)
INSERT INTO curricula (id, board_id, grade, subject, description, active, created_at, updated_at) VALUES
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a83', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 8', 'Social Science', 'CBSE Grade 8 Social Science Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Chapters for Grade 8 Social Science
INSERT INTO chapters (id, curriculum_id, chapter_number, title, description, estimated_teaching_hours, display_order, active, created_at, updated_at) VALUES
('80301010-0000-0000-0000-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a83', 1, 'How, When and Where', 'Periodisation of history, colonial records, and modern Indian historical sources', 8, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('80301010-0000-0000-0000-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a83', 2, 'From Trade to Territory', 'Establishment of East India Company power, battles of Plassey and Buxar', 10, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Topics for Grade 8 Social Science Chapters
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('80302020-0000-0000-0000-000000000001', '80301010-0000-0000-0000-000000000001', 'Periodisation and Official Records', 'Understand historical dates and British administrative records', 'history, dates, records, archives', 50, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('80302020-0000-0000-0000-000000000002', '80301010-0000-0000-0000-000000000002', 'Establishment of East India Company Rule', 'Analyze trade expansion and territorial conquests in 18th century India', 'company, plassey, buxar, trade', 60, 'INTERMEDIATE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Additional Topics for Grade 8 Science & Mathematics Chapters
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('11111111-9c0b-4ef8-bb6d-6bb9bd380a05', '10101010-9c0b-4ef8-bb6d-6bb9bd380a03', 'Types of Synthetic Fibres', 'Characteristics of Rayon, Nylon, Polyester, and Acrylic', 'rayon, nylon, polyester, acrylic', 45, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11111111-9c0b-4ef8-bb6d-6bb9bd380a06', '10101010-9c0b-4ef8-bb6d-6bb9bd380a03', 'Plastics and Environmental Conservation', 'Thermoplastics, thermosetting plastics, and 5R principle', 'plastics, recycling, environment, 5R', 45, 'INTERMEDIATE', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22222222-9c0b-4ef8-bb6d-6bb9bd380b03', '20202020-9c0b-4ef8-bb6d-6bb9bd380b01', 'Representation of Rational Numbers on Number Line', 'Locate rational numbers on a real line and find rational numbers between any two numbers', 'number line, density property', 50, 'INTERMEDIATE', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22222222-9c0b-4ef8-bb6d-6bb9bd380b04', '20202020-9c0b-4ef8-bb6d-6bb9bd380b02', 'Applications of Linear Equations', 'Formulate and solve real-world word problems using linear equations', 'word problems, age, perimeter', 60, 'INTERMEDIATE', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5. Additional Topics for Grade 9 & Grade 10 Chapters
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('90102020-0000-0000-0000-000000000002', '90101010-0000-0000-0000-000000000002', 'Zeroes of Polynomial & Factor Theorem', 'Evaluate polynomial roots and apply factor theorem', 'zeroes, factors, remainder', 55, 'INTERMEDIATE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('90302020-0000-0000-0000-000000000002', '90301010-0000-0000-0000-000000000002', 'Location, Size, and Neighbors of India', 'Study Tropic of Cancer, Standard Meridian, and neighboring nations', 'latitudes, longitudes, meridian', 45, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10102020-0000-0000-0000-000000000003', '10101010-0000-0000-0000-000000000002', 'Quadratic Formula and Word Problems', 'Apply standard quadratic formula to solve real-life applications', 'formula, roots, word problems', 60, 'ADVANCED', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10302020-0000-0000-0000-000000000003', '10301010-0000-0000-0000-000000000001', 'Unification of Germany and Italy', 'Role of Bismarck, Cavour, and Garibaldi in European nation building', 'unification, bismarck, cavour', 55, 'INTERMEDIATE', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

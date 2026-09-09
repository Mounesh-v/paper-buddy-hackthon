-- Migration V11: Seed Grade 9 and Grade 10 Curricula for Mathematics, Science, and Social Science

-- 1. Curricula (Grade 9 & Grade 10 ONLY for Mathematics, Science, Social Science)
INSERT INTO curricula (id, board_id, grade, subject, description, active, created_at, updated_at) VALUES
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 9', 'Mathematics', 'CBSE Grade 9 Mathematics Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a92', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 9', 'Science', 'CBSE Grade 9 Science Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a93', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 9', 'Social Science', 'CBSE Grade 9 Social Science Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 10', 'Mathematics', 'CBSE Grade 10 Mathematics Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 10', 'Science', 'CBSE Grade 10 Science Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 10', 'Social Science', 'CBSE Grade 10 Social Science Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Chapters (Strictly linked to their parent curriculum)
-- Grade 9 Mathematics Chapters
INSERT INTO chapters (id, curriculum_id, chapter_number, title, description, estimated_teaching_hours, display_order, active, created_at, updated_at) VALUES
('90101010-0000-0000-0000-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 1, 'Number Systems', 'Real numbers, irrational numbers, and exponent laws', 10, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('90101010-0000-0000-0000-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 2, 'Polynomials', 'Zeroes of polynomial, remainder theorem, and factorization', 8, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 9 Science Chapters
INSERT INTO chapters (id, curriculum_id, chapter_number, title, description, estimated_teaching_hours, display_order, active, created_at, updated_at) VALUES
('90201010-0000-0000-0000-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a92', 1, 'Matter in Our Surroundings', 'Physical nature of matter, states of matter, and evaporation', 8, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('90201010-0000-0000-0000-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a92', 2, 'Atoms and Molecules', 'Laws of chemical combination and mole concept', 10, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 9 Social Science Chapters
INSERT INTO chapters (id, curriculum_id, chapter_number, title, description, estimated_teaching_hours, display_order, active, created_at, updated_at) VALUES
('90301010-0000-0000-0000-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a93', 1, 'The French Revolution', 'French society during the late 18th century and revolution', 8, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('90301010-0000-0000-0000-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a93', 2, 'India - Size and Location', 'Geographical location, standard meridian, and neighbors', 6, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 10 Mathematics Chapters
INSERT INTO chapters (id, curriculum_id, chapter_number, title, description, estimated_teaching_hours, display_order, active, created_at, updated_at) VALUES
('10101010-0000-0000-0000-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 1, 'Real Numbers', 'Fundamental Theorem of Arithmetic and irrationality proofs', 8, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10101010-0000-0000-0000-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 2, 'Quadratic Equations', 'Solving quadratic equations by factorization and formula', 10, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 10 Science Chapters
INSERT INTO chapters (id, curriculum_id, chapter_number, title, description, estimated_teaching_hours, display_order, active, created_at, updated_at) VALUES
('10201010-0000-0000-0000-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 1, 'Chemical Reactions and Equations', 'Types of chemical reactions and balancing chemical equations', 10, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10201010-0000-0000-0000-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 2, 'Life Processes', 'Nutrition, respiration, transportation, and excretion', 12, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10201010-0000-0000-0000-000000000003', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 3, 'Light - Reflection and Refraction', 'Spherical mirrors, lenses, and refractive index', 10, 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 10 Social Science Chapters
INSERT INTO chapters (id, curriculum_id, chapter_number, title, description, estimated_teaching_hours, display_order, active, created_at, updated_at) VALUES
('10301010-0000-0000-0000-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 1, 'Rise of Nationalism in Europe', 'French Revolution and the idea of nation in Europe', 10, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10301010-0000-0000-0000-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 2, 'Resources and Development', 'Classification and conservation of resources', 8, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Topics (Strictly linked to their parent chapter)
-- Grade 10 Science Topics
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('10202020-0000-0000-0000-000000000001', '10201010-0000-0000-0000-000000000001', 'Chemical Equations & Balancing', 'Write and balance chemical equations conserving mass', 'balancing, reactants, products', 60, 'ADVANCED', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10202020-0000-0000-0000-000000000002', '10201010-0000-0000-0000-000000000001', 'Types of Chemical Reactions', 'Combination, decomposition, displacement, and redox reactions', 'combination, decomposition, redox', 60, 'INTERMEDIATE', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10202020-0000-0000-0000-000000000003', '10201010-0000-0000-0000-000000000002', 'Autotrophic & Heterotrophic Nutrition', 'Photosynthesis and human digestive system', 'nutrition, stomata, digestion', 60, 'INTERMEDIATE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10202020-0000-0000-0000-000000000004', '10201010-0000-0000-0000-000000000003', 'Reflection by Spherical Mirrors', 'Concave and convex mirror ray diagrams and mirror formula', 'mirrors, focus, magnification', 60, 'ADVANCED', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 10 Math Topics
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('10102020-0000-0000-0000-000000000001', '10101010-0000-0000-0000-000000000001', 'Fundamental Theorem of Arithmetic', 'Prime factorization of composite numbers', 'prime, HCF, LCM', 50, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10102020-0000-0000-0000-000000000002', '10101010-0000-0000-0000-000000000002', 'Discriminant & Nature of Roots', 'Calculate b^2 - 4ac to classify real and complex roots', 'discriminant, roots, quadratic', 60, 'INTERMEDIATE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 10 Social Science Topics
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('10302020-0000-0000-0000-000000000001', '10301010-0000-0000-0000-000000000001', 'The French Revolution and the Idea of Nation', 'Creation of collective identity in 18th century France', 'revolution, nation-state, liberalism', 50, 'INTERMEDIATE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10302020-0000-0000-0000-000000000002', '10301010-0000-0000-0000-000000000002', 'Resource Planning and Soil Conservation', 'Methods of soil conservation and resource mapping', 'resources, soil erosion, conservation', 50, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 9 Science Topics
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('90202020-0000-0000-0000-000000000001', '90201010-0000-0000-0000-000000000001', 'States of Matter & Evaporation', 'Compare properties of solid, liquid and gas states', 'matter, states, evaporation', 50, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('90202020-0000-0000-0000-000000000002', '90201010-0000-0000-0000-000000000002', 'Laws of Chemical Combination', 'Law of conservation of mass and constant proportions', 'mass, law, molecules', 60, 'INTERMEDIATE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 9 Math Topics
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('90102020-0000-0000-0000-000000000001', '90101010-0000-0000-0000-000000000001', 'Representation of Real Numbers', 'Plotting irrational numbers on number line', 'real numbers, radicals', 50, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Grade 9 Social Science Topics
INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('90302020-0000-0000-0000-000000000001', '90301010-0000-0000-0000-000000000001', 'Outbreak of French Revolution', 'Estates General and Storming of Bastille', 'bastille, estates, revolution', 50, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

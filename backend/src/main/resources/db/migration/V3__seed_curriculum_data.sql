-- Migration V3: Seed Sample Curriculum & Content Management Data

INSERT INTO boards (id, board_name, board_code, description, active, created_at, updated_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Central Board of Secondary Education', 'CBSE', 'National level board of education in India for public and private schools', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Indian Certificate of Secondary Education', 'ICSE', 'Private national-level board of school education in India', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO curricula (id, board_id, grade, subject, description, active, created_at, updated_at) VALUES
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 8', 'Science', 'CBSE Grade 8 General Science Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 8', 'Mathematics', 'CBSE Grade 8 Mathematics Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 9', 'Science', 'CBSE Grade 9 Science Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 10', 'Science', 'CBSE Grade 10 Science Curriculum', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO chapters (id, curriculum_id, chapter_number, title, description, estimated_teaching_hours, display_order, active, created_at, updated_at) VALUES
('10101010-9c0b-4ef8-bb6d-6bb9bd380a01', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1, 'Crop Production and Management', 'Study of agricultural practices, soil preparation, sowing, and harvesting', 10, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10101010-9c0b-4ef8-bb6d-6bb9bd380a02', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 2, 'Microorganisms: Friend and Foe', 'Classification of micro-organisms, commercial uses, and disease-causing pathogens', 8, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10101010-9c0b-4ef8-bb6d-6bb9bd380a03', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 3, 'Synthetic Fibres and Plastics', 'Types of synthetic fibers and plastic impact on environment', 6, 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('20202020-9c0b-4ef8-bb6d-6bb9bd380b01', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 1, 'Rational Numbers', 'Properties of rational numbers, representation on number line, and operations', 10, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('20202020-9c0b-4ef8-bb6d-6bb9bd380b02', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 2, 'Linear Equations in One Variable', 'Solving linear equations with variable on one and both sides', 8, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30303030-9c0b-4ef8-bb6d-6bb9bd380c01', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 1, 'Matter in Our Surroundings', 'Physical nature of matter, states of matter, and evaporation', 8, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('40404040-9c0b-4ef8-bb6d-6bb9bd380d01', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 1, 'Chemical Reactions and Equations', 'Types of chemical reactions, balancing equations, and oxidation-reduction', 10, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO topics (id, chapter_id, topic_name, learning_objectives, keywords, estimated_teaching_minutes, difficulty_level, display_order, active, created_at, updated_at) VALUES
('11111111-9c0b-4ef8-bb6d-6bb9bd380a01', '10101010-9c0b-4ef8-bb6d-6bb9bd380a01', 'Agricultural Practices', 'Understand basic steps in crop production and crop classification', 'crops, kharif, rabi, agriculture', 45, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11111111-9c0b-4ef8-bb6d-6bb9bd380a02', '10101010-9c0b-4ef8-bb6d-6bb9bd380a01', 'Basic Practices of Crop Production', 'Learn soil preparation, tilling, ploughing, and levelling tools', 'soil, ploughing, tilling, levelling', 60, 'INTERMEDIATE', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11111111-9c0b-4ef8-bb6d-6bb9bd380a03', '10101010-9c0b-4ef8-bb6d-6bb9bd380a02', 'Classification of Microorganisms', 'Identify bacteria, fungi, protozoa, and algae', 'bacteria, fungi, protozoa, algae, virus', 50, 'INTERMEDIATE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11111111-9c0b-4ef8-bb6d-6bb9bd380a04', '10101010-9c0b-4ef8-bb6d-6bb9bd380a02', 'Friendly Microorganisms', 'Understand role of microbes in commercial production, medicine, and soil fertility', 'fermentation, yeast, antibiotics, vaccines', 45, 'BEGINNER', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22222222-9c0b-4ef8-bb6d-6bb9bd380b01', '20202020-9c0b-4ef8-bb6d-6bb9bd380b01', 'Properties of Rational Numbers', 'Closure, commutativity, and associativity of rational numbers', 'rational, closure, commutative, associative', 60, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22222222-9c0b-4ef8-bb6d-6bb9bd380b02', '20202020-9c0b-4ef8-bb6d-6bb9bd380b02', 'Solving Equations Having Variables on Both Sides', 'Apply linear algebra techniques to solve linear equations', 'equation, variable, transpose', 60, 'INTERMEDIATE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('33333333-9c0b-4ef8-bb6d-6bb9bd380c01', '30303030-9c0b-4ef8-bb6d-6bb9bd380c01', 'States of Matter', 'Compare solid, liquid, and gas state properties and particle arrangement', 'solid, liquid, gas, plasma', 50, 'BEGINNER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('44444444-9c0b-4ef8-bb6d-6bb9bd380d01', '40404040-9c0b-4ef8-bb6d-6bb9bd380d01', 'Chemical Equations & Balancing', 'Write and balance chemical equations conserving mass', 'reactants, products, balancing, stoichiometry', 60, 'ADVANCED', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('44444444-9c0b-4ef8-bb6d-6bb9bd380d02', '40404040-9c0b-4ef8-bb6d-6bb9bd380d01', 'Types of Chemical Reactions', 'Classify combination, decomposition, displacement, and double displacement reactions', 'combination, decomposition, displacement, redox', 60, 'INTERMEDIATE', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    // Users table (parents and admin)
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('phone_number');
      table.enum('role', ['PARENT', 'TEACHER', 'ADMIN']).defaultTo('PARENT');
      table.boolean('is_active').defaultTo(true);
      table.string('reset_token');
      table.timestamp('reset_token_expires');
      table.timestamps(true, true);
    })

    // Classes table
    .createTable('classes', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('section');
      table.string('grade');
      table.timestamps(true, true);
    })

    // Students table
    .createTable('students', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('email');
      table.string('roll_number');
      table.string('phone_number');
      table.date('date_of_birth');
      table.string('gender');
      table.uuid('class_id').references('id').inTable('classes').onDelete('SET NULL');
      table.timestamps(true, true);
    })

    // Parent-Student relationship
    .createTable('parent_students', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('parent_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
      table.unique(['parent_id', 'student_id']);
      table.timestamps(true, true);
    })

    // Subjects table
    .createTable('subjects', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('code');
      table.timestamps(true, true);
    })

    // Student Subjects (which subjects a student has)
    .createTable('student_subjects', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
      table.uuid('subject_id').references('id').inTable('subjects').onDelete('CASCADE');
      table.uuid('teacher_id').references('id').inTable('users').onDelete('SET NULL');
      table.unique(['student_id', 'subject_id']);
      table.timestamps(true, true);
    })

    // Attendance table
    .createTable('attendance', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
      table.date('date').notNullable();
      table.enum('status', ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).defaultTo('PRESENT');
      table.string('remark');
      table.unique(['student_id', 'date']);
      table.timestamps(true, true);
    })

    // Exams table
    .createTable('exams', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.date('date');
      table.date('end_date');
      table.string('type');
      table.timestamps(true, true);
    })

    // Exam Results
    .createTable('exam_results', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
      table.uuid('exam_id').references('id').inTable('exams').onDelete('CASCADE');
      table.uuid('subject_id').references('id').inTable('subjects').onDelete('CASCADE');
      table.decimal('marks_obtained', 5, 2);
      table.decimal('total_marks', 5, 2);
      table.string('grade');
      table.string('remark');
      table.timestamps(true, true);
      table.unique(['student_id', 'exam_id', 'subject_id']);
    })

    // Assignments table
    .createTable('assignments', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('title').notNullable();
      table.text('description');
      table.uuid('subject_id').references('id').inTable('subjects').onDelete('SET NULL');
      table.uuid('teacher_id').references('id').inTable('users').onDelete('SET NULL');
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
      table.timestamp('due_date');
      table.enum('status', ['PENDING', 'SUBMITTED', 'GRADED', 'OVERDUE']).defaultTo('PENDING');
      table.decimal('marks', 5, 2);
      table.decimal('total_marks', 5, 2);
      table.string('grade');
      table.text('feedback');
      table.timestamp('submitted_date');
      table.jsonb('attachments');
      table.timestamps(true, true);
    })

    // Fees table
    .createTable('fees', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('category');
      table.decimal('amount', 10, 2).notNullable();
      table.date('due_date');
      table.enum('status', ['PENDING', 'PAID', 'OVERDUE', 'PARTIAL']).defaultTo('PENDING');
      table.decimal('paid_amount', 10, 2).defaultTo(0);
      table.date('paid_date');
      table.string('payment_method');
      table.string('transaction_id');
      table.string('receipt_number');
      table.timestamps(true, true);
    })

    // Events table
    .createTable('events', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('title').notNullable();
      table.text('description');
      table.enum('type', ['EXAM', 'HOLIDAY', 'PTM', 'COMPETITION', 'OTHER']).defaultTo('OTHER');
      table.date('date');
      table.string('time');
      table.string('end_time');
      table.string('location');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })

    // Announcements table
    .createTable('announcements', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('title').notNullable();
      table.text('description');
      table.text('content');
      table.uuid('author_id').references('id').inTable('users').onDelete('SET NULL');
      table.string('author_name');
      table.string('school');
      table.enum('priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT']).defaultTo('LOW');
      table.boolean('is_active').defaultTo(true);
      table.jsonb('attachments');
      table.timestamps(true, true);
    })

    // Notifications table
    .createTable('notifications', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('message');
      table.enum('type', [
        'ATTENDANCE', 'FEE', 'ACADEMIC', 'ASSIGNMENT',
        'EVENT', 'ANNOUNCEMENT', 'MESSAGE', 'SYSTEM'
      ]).defaultTo('SYSTEM');
      table.string('reference_id');
      table.boolean('is_read').defaultTo(false);
      table.timestamps(true, true);
    })

    // Conversations table
    .createTable('conversations', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name');
      table.timestamps(true, true);
    })

    // Conversation Participants
    .createTable('conversation_participants', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('conversation_id').references('id').inTable('conversations').onDelete('CASCADE');
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.unique(['conversation_id', 'user_id']);
      table.timestamps(true, true);
    })

    // Messages table
    .createTable('messages', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('conversation_id').references('id').inTable('conversations').onDelete('CASCADE');
      table.uuid('sender_id').references('id').inTable('users').onDelete('SET NULL');
      table.text('content').notNullable();
      table.boolean('is_read').defaultTo(false);
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('messages')
    .dropTableIfExists('conversation_participants')
    .dropTableIfExists('conversations')
    .dropTableIfExists('notifications')
    .dropTableIfExists('announcements')
    .dropTableIfExists('events')
    .dropTableIfExists('fees')
    .dropTableIfExists('assignments')
    .dropTableIfExists('exam_results')
    .dropTableIfExists('exams')
    .dropTableIfExists('attendance')
    .dropTableIfExists('student_subjects')
    .dropTableIfExists('subjects')
    .dropTableIfExists('parent_students')
    .dropTableIfExists('students')
    .dropTableIfExists('classes')
    .dropTableIfExists('users');
};

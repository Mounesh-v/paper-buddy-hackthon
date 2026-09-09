const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clean all tables
  await knex('messages').del();
  await knex('conversation_participants').del();
  await knex('conversations').del();
  await knex('notifications').del();
  await knex('announcements').del();
  await knex('events').del();
  await knex('fees').del();
  await knex('assignments').del();
  await knex('exam_results').del();
  await knex('exams').del();
  await knex('attendance').del();
  await knex('student_subjects').del();
  await knex('subjects').del();
  await knex('parent_students').del();
  await knex('students').del();
  await knex('classes').del();
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create parent user
  const [parent] = await knex('users')
    .insert({
      name: 'Rajesh Sharma',
      email: 'parent@example.com',
      password: hashedPassword,
      phone_number: '9876543210',
      role: 'PARENT',
    })
    .returning('*');

  // Create teacher user
  const [teacher] = await knex('users')
    .insert({
      name: 'Priya Patel',
      email: 'teacher@example.com',
      password: hashedPassword,
      phone_number: '9876543211',
      role: 'TEACHER',
    })
    .returning('*');

  // Create admin user
  const [admin] = await knex('users')
    .insert({
      name: 'School Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      phone_number: '9876543212',
      role: 'ADMIN',
    })
    .returning('*');

  // Create classes
  const [class1] = await knex('classes')
    .insert({ name: 'Class 10', section: 'A', grade: '10' })
    .returning('*');

  const [class2] = await knex('classes')
    .insert({ name: 'Class 8', section: 'B', grade: '8' })
    .returning('*');

  // Create students
  const [student1] = await knex('students')
    .insert({
      name: 'Arjun Sharma',
      roll_number: '10A001',
      class_id: class1.id,
      gender: 'Male',
      date_of_birth: '2008-05-15',
    })
    .returning('*');

  const [student2] = await knex('students')
    .insert({
      name: 'Ananya Sharma',
      roll_number: '8B002',
      class_id: class2.id,
      gender: 'Female',
      date_of_birth: '2010-08-22',
    })
    .returning('*');

  // Link students to parent
  await knex('parent_students').insert([
    { parent_id: parent.id, student_id: student1.id },
    { parent_id: parent.id, student_id: student2.id },
  ]);

  // Create subjects
  const [math] = await knex('subjects')
    .insert({ name: 'Mathematics', code: 'MATH101' })
    .returning('*');

  const [science] = await knex('subjects')
    .insert({ name: 'Science', code: 'SCI101' })
    .returning('*');

  const [english] = await knex('subjects')
    .insert({ name: 'English', code: 'ENG101' })
    .returning('*');

  const [hindi] = await knex('subjects')
    .insert({ name: 'Hindi', code: 'HIN101' })
    .returning('*');

  const [social] = await knex('subjects')
    .insert({ name: 'Social Studies', code: 'SST101' })
    .returning('*');

  // Assign subjects to students
  await knex('student_subjects').insert([
    { student_id: student1.id, subject_id: math.id, teacher_id: teacher.id },
    { student_id: student1.id, subject_id: science.id, teacher_id: teacher.id },
    { student_id: student1.id, subject_id: english.id, teacher_id: teacher.id },
    { student_id: student1.id, subject_id: hindi.id, teacher_id: teacher.id },
    { student_id: student1.id, subject_id: social.id, teacher_id: teacher.id },
    { student_id: student2.id, subject_id: math.id, teacher_id: teacher.id },
    { student_id: student2.id, subject_id: science.id, teacher_id: teacher.id },
    { student_id: student2.id, subject_id: english.id, teacher_id: teacher.id },
  ]);

  // Create attendance for last 30 days
  const attendanceRecords = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0) continue; // Skip Sundays

    attendanceRecords.push({
      student_id: student1.id,
      date: date.toISOString().split('T')[0],
      status: Math.random() > 0.1 ? 'PRESENT' : 'ABSENT',
    });
    attendanceRecords.push({
      student_id: student2.id,
      date: date.toISOString().split('T')[0],
      status: Math.random() > 0.05 ? 'PRESENT' : Math.random() > 0.5 ? 'LATE' : 'ABSENT',
    });
  }
  await knex('attendance').insert(attendanceRecords);

  // Create exams
  const [exam1] = await knex('exams')
    .insert({
      name: 'Mid-Term Examination',
      date: '2026-09-15',
      end_date: '2026-09-25',
      type: 'MIDTERM',
    })
    .returning('*');

  const [exam2] = await knex('exams')
    .insert({
      name: 'Unit Test 1',
      date: '2026-08-10',
      end_date: '2026-08-12',
      type: 'UNIT_TEST',
    })
    .returning('*');

  // Create exam results
  await knex('exam_results').insert([
    { student_id: student1.id, exam_id: exam2.id, subject_id: math.id, marks_obtained: 85, total_marks: 100, grade: 'A' },
    { student_id: student1.id, exam_id: exam2.id, subject_id: science.id, marks_obtained: 78, total_marks: 100, grade: 'B+' },
    { student_id: student1.id, exam_id: exam2.id, subject_id: english.id, marks_obtained: 92, total_marks: 100, grade: 'A+' },
    { student_id: student1.id, exam_id: exam2.id, subject_id: hindi.id, marks_obtained: 70, total_marks: 100, grade: 'B' },
    { student_id: student1.id, exam_id: exam2.id, subject_id: social.id, marks_obtained: 88, total_marks: 100, grade: 'A' },
    { student_id: student2.id, exam_id: exam2.id, subject_id: math.id, marks_obtained: 90, total_marks: 100, grade: 'A+' },
    { student_id: student2.id, exam_id: exam2.id, subject_id: science.id, marks_obtained: 82, total_marks: 100, grade: 'A' },
    { student_id: student2.id, exam_id: exam2.id, subject_id: english.id, marks_obtained: 75, total_marks: 100, grade: 'B+' },
  ]);

  // Create assignments
  const [assignment1] = await knex('assignments')
    .insert({
      title: 'Algebra Homework',
      description: 'Complete exercises 3.1 to 3.5 from the textbook. Show all working steps.',
      subject_id: math.id,
      teacher_id: teacher.id,
      student_id: student1.id,
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      total_marks: 50,
    })
    .returning('*');

  const [assignment2] = await knex('assignments')
    .insert({
      title: 'Science Project',
      description: 'Create a working model of the solar system.',
      subject_id: science.id,
      teacher_id: teacher.id,
      student_id: student1.id,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      total_marks: 100,
    })
    .returning('*');

  await knex('assignments').insert([
    {
      title: 'English Essay',
      description: 'Write an essay on "My Favorite Holiday" in 500 words.',
      subject_id: english.id,
      teacher_id: teacher.id,
      student_id: student1.id,
      due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'SUBMITTED',
      submitted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      total_marks: 20,
      marks: 18,
      grade: 'A',
      feedback: 'Excellent writing! Good use of vocabulary.',
    },
    {
      title: 'Hindi Worksheet',
      description: 'Complete the grammar worksheet on Samas.',
      subject_id: hindi.id,
      teacher_id: teacher.id,
      student_id: student1.id,
      due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'GRADED',
      submitted_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      total_marks: 25,
      marks: 20,
      grade: 'B+',
      feedback: 'Good effort. Work on compound words.',
    },
    {
      title: 'Math Practice Set',
      description: 'Solve quadratic equations practice set.',
      subject_id: math.id,
      teacher_id: teacher.id,
      student_id: student2.id,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      total_marks: 30,
    },
  ]);

  // Create fees
  await knex('fees').insert([
    {
      student_id: student1.id,
      name: 'Tuition Fee - Q3',
      category: 'Tuition',
      amount: 25000,
      due_date: '2026-09-30',
      status: 'PENDING',
    },
    {
      student_id: student1.id,
      name: 'Library Fee',
      category: 'Library',
      amount: 2000,
      due_date: '2026-09-15',
      status: 'PAID',
      paid_amount: 2000,
      paid_date: '2026-08-20',
      payment_method: 'Online',
      transaction_id: 'TXN001',
      receipt_number: 'REC-2026-001',
    },
    {
      student_id: student1.id,
      name: 'Lab Fee',
      category: 'Laboratory',
      amount: 3000,
      due_date: '2026-08-31',
      status: 'OVERDUE',
    },
    {
      student_id: student2.id,
      name: 'Tuition Fee - Q3',
      category: 'Tuition',
      amount: 22000,
      due_date: '2026-09-30',
      status: 'PENDING',
    },
    {
      student_id: student2.id,
      name: 'Activity Fee',
      category: 'Activities',
      amount: 1500,
      due_date: '2026-08-15',
      status: 'PAID',
      paid_amount: 1500,
      paid_date: '2026-08-10',
      payment_method: 'Cash',
      receipt_number: 'REC-2026-002',
    },
  ]);

  // Create events
  await knex('events').insert([
    {
      title: 'Parent-Teacher Meeting',
      description: 'Discuss student progress and report card review.',
      type: 'PTM',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00 AM',
      end_time: '12:00 PM',
      location: 'School Auditorium',
    },
    {
      title: 'Annual Day Celebration',
      description: 'Cultural performances and prize distribution.',
      type: 'COMPETITION',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '9:00 AM',
      location: 'School Ground',
    },
    {
      title: 'Mathematics Olympiad',
      description: 'Inter-school mathematics competition.',
      type: 'COMPETITION',
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '2:00 PM',
      location: 'Math Lab',
    },
    {
      title: 'Diwali Break',
      description: 'School closed for Diwali celebrations.',
      type: 'HOLIDAY',
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      title: 'Mid-Term Examinations Begin',
      description: 'Mid-term examination schedule will be shared soon.',
      type: 'EXAM',
      date: '2026-09-15',
      time: '9:00 AM',
    },
  ]);

  // Create announcements
  await knex('announcements').insert([
    {
      title: 'New School Timings',
      description: 'Effective from next Monday, school timing will be 8:00 AM to 2:30 PM.',
      content: 'Dear Parents,Please note that the school timings have been revised. The new timing will be effective from next Monday. Students are expected to reach school by 7:50 AM.',
      author_id: admin.id,
      author_name: 'School Admin',
      school: 'Springfield Public School',
      priority: 'HIGH',
    },
    {
      title: 'Sports Day Registration',
      description: 'Registration for annual sports day is now open.',
      content: 'Dear Parents,The annual sports day will be held on 15th October. Students interested in participating can register with their PE teacher. Events include track and field, basketball, cricket, and more.',
      author_id: teacher.id,
      author_name: 'Priya Patel',
      school: 'Springfield Public School',
      priority: 'MEDIUM',
    },
    {
      title: 'Science Exhibition',
      description: 'Students are encouraged to participate in the science exhibition.',
      content: 'Dear Parents,We are organizing a science exhibition on 20th October. Students can showcase their science projects. Parents are welcome to attend.',
      author_id: teacher.id,
      author_name: 'Priya Patel',
      school: 'Springfield Public School',
      priority: 'LOW',
    },
  ]);

  // Create notifications
  await knex('notifications').insert([
    {
      user_id: parent.id,
      title: 'Attendance Alert',
      message: 'Arjun was absent today.',
      type: 'ATTENDANCE',
      reference_id: student1.id,
      is_read: false,
    },
    {
      user_id: parent.id,
      title: 'Fee Payment Reminder',
      message: 'Tuition fee for Arjun is due on 30th September.',
      type: 'FEE',
      reference_id: student1.id,
      is_read: false,
    },
    {
      user_id: parent.id,
      title: 'Assignment Due',
      message: 'Algebra homework is due in 3 days.',
      type: 'ASSIGNMENT',
      reference_id: assignment1.id,
      is_read: true,
    },
    {
      user_id: parent.id,
      title: 'Exam Results Published',
      message: 'Unit Test 1 results are now available.',
      type: 'ACADEMIC',
      reference_id: exam2.id,
      is_read: true,
    },
    {
      user_id: parent.id,
      title: 'New Announcement',
      message: 'New school timings effective from next Monday.',
      type: 'ANNOUNCEMENT',
      is_read: false,
    },
  ]);

  // Create conversation
  const [conversation] = await knex('conversations')
    .insert({ name: 'Parent-Teacher Chat' })
    .returning('*');

  await knex('conversation_participants').insert([
    { conversation_id: conversation.id, user_id: parent.id },
    { conversation_id: conversation.id, user_id: teacher.id },
  ]);

  // Create messages
  await knex('messages').insert([
    {
      conversation_id: conversation.id,
      sender_id: teacher.id,
      content: 'Hello! I wanted to discuss Arjun\'s progress in Mathematics.',
      is_read: true,
    },
    {
      conversation_id: conversation.id,
      sender_id: parent.id,
      content: 'Hello Ma\'am! Yes, please go ahead. How is he performing?',
      is_read: true,
    },
    {
      conversation_id: conversation.id,
      sender_id: teacher.id,
      content: 'Arjun is doing well in class. His algebra skills have improved significantly. However, he needs to work on geometry.',
      is_read: true,
    },
    {
      conversation_id: conversation.id,
      sender_id: parent.id,
      content: 'Thank you for the feedback. I will make sure he practices more geometry at home.',
      is_read: true,
    },
    {
      conversation_id: conversation.id,
      sender_id: teacher.id,
      content: 'That would be great! Also, the mid-term exams are coming up. Please ensure he revises all chapters.',
      is_read: false,
    },
  ]);

  console.log('Seed data inserted successfully!');
};

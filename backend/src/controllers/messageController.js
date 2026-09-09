const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await db('conversations')
      .join('conversation_participants', 'conversations.id', 'conversation_participants.conversation_id')
      .where('conversation_participants.user_id', req.user.id)
      .select('conversations.*')
      .orderBy('conversations.updated_at', 'desc');

    // Enrich with last message and participant info
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        // Get other participants
        const participants = await db('conversation_participants')
          .join('users', 'conversation_participants.user_id', 'users.id')
          .where('conversation_participants.conversation_id', conv.id)
          .andWhereNot('conversation_participants.user_id', req.user.id)
          .select('users.id', 'users.name');

        // Get last message
        const lastMessage = await db('messages')
          .where({ conversation_id: conv.id })
          .orderBy('created_at', 'desc')
          .select('content', 'created_at')
          .first();

        // Get unread count
        const unread = await db('messages')
          .where({
            conversation_id: conv.id,
            is_read: false,
          })
          .andWhereNot('sender_id', req.user.id)
          .count('id as count')
          .first();

        return {
          ...conv,
          name: participants.map((p) => p.name).join(', '),
          participants,
          lastMessage: lastMessage || null,
          unreadCount: parseInt(unread.count) || 0,
        };
      })
    );

    return success(res, enriched);
  } catch (err) {
    next(err);
  }
};

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await db('student_subjects')
      .join('students', 'student_subjects.student_id', 'students.id')
      .join('parent_students', 'students.id', 'parent_students.student_id')
      .join('users', 'student_subjects.teacher_id', 'users.id')
      .where('parent_students.parent_id', req.user.id)
      .where('users.role', 'TEACHER')
      .select('users.id', 'users.name', 'users.email')
      .distinct();

    return success(res, teachers);
  } catch (err) {
    next(err);
  }
};

exports.createConversation = async (req, res, next) => {
  try {
    const { participantIds, name } = req.body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return error(res, 'Participant IDs are required.', 400);
    }

    // Create conversation
    const [conversation] = await db('conversations')
      .insert({ name: name || null })
      .returning('*');

    // Add participants (including current user)
    const allParticipants = [...new Set([req.user.id, ...participantIds])];
    await db('conversation_participants').insert(
      allParticipants.map((userId) => ({
        conversation_id: conversation.id,
        user_id: userId,
      }))
    );

    return success(res, conversation, 'Conversation created', 201);
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Verify user is participant
    const participation = await db('conversation_participants')
      .where({ conversation_id: conversationId, user_id: req.user.id })
      .first();

    if (!participation) {
      return error(res, 'Access denied.', 403);
    }

    const messages = await db('messages')
      .leftJoin('users', 'messages.sender_id', 'users.id')
      .where('messages.conversation_id', conversationId)
      .select(
        'messages.*',
        'users.name as senderName'
      )
      .orderBy('messages.created_at', 'asc')
      .limit(limit)
      .offset(offset);

    // Mark messages as read
    await db('messages')
      .where({
        conversation_id: conversationId,
        is_read: false,
      })
      .andWhereNot('sender_id', req.user.id)
      .update({ is_read: true });

    return success(res, messages);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return error(res, 'Message content is required.', 400);
    }

    // Verify user is participant
    const participation = await db('conversation_participants')
      .where({ conversation_id: conversationId, user_id: req.user.id })
      .first();

    if (!participation) {
      return error(res, 'Access denied.', 403);
    }

    const [message] = await db('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: req.user.id,
        content: content.trim(),
      })
      .returning('*');

    // Update conversation timestamp
    await db('conversations')
      .where({ id: conversationId })
      .update({ updated_at: new Date() });

    return success(res, {
      ...message,
      senderName: req.user.name,
    }, 'Message sent', 201);
  } catch (err) {
    next(err);
  }
};

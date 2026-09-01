const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { success, error } = require('../utils/responses');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return { accessToken, refreshToken };
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, requestedRole } = req.body;

    const user = await db('users').where({ email }).first();

    if (!user) {
      return error(res, 'Invalid email or password.', 401);
    }

    if (!user.is_active) {
      return error(res, 'Your account has been suspended.', 403);
    }

    if (requestedRole && user.role !== requestedRole) {
      return error(res, 'Unauthorized role. Access denied.', 403);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return error(res, 'Invalid email or password.', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    return success(res, {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return error(res, 'Email already registered.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

    const [user] = await db('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        phone_number: phoneNumber,
        role: 'PARENT',
      })
      .returning(['id', 'name', 'email', 'role']);

    const { accessToken, refreshToken } = generateTokens(user.id);

    return success(res, {
      accessToken,
      refreshToken,
      user,
    }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await db('users').where({ email }).first();

    // Always return success to prevent email enumeration
    if (!user) {
      return success(res, null, 'If the email exists, a reset link has been sent.');
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await db('users')
      .where({ id: user.id })
      .update({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires,
      });

    // In production, send email here
    return success(res, null, 'If the email exists, a reset link has been sent.');
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return error(res, 'Refresh token required.', 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await db('users').where({ id: decoded.userId }).first();
    if (!user) {
      return error(res, 'Invalid refresh token.', 401);
    }

    const tokens = generateTokens(user.id);

    return success(res, tokens, 'Token refreshed successfully');
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Refresh token expired. Please login again.', 401);
    }
    return error(res, 'Invalid refresh token.', 401);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // In production, add token to blacklist
    return success(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'name', 'email', 'phone_number', 'role', 'created_at')
      .first();

    return success(res, user);
  } catch (err) {
    next(err);
  }
};

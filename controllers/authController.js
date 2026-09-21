const authService = require('../services/authService');
const userModel = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// In production the client and API are on two different Render domains, so
// the cookie is cross-site — that requires SameSite=None, which in turn
// requires Secure (browsers reject None without it). Locally both run on
// localhost with different ports, which the (same-site) Lax policy still
// allows.
const isProduction = process.env.NODE_ENV === 'production';
const COOKIE_OPTIONS = {
  httpOnly: true, // client-side JS can never read this cookie
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction, // HTTPS-only outside local dev
};

function setAuthCookie(res, token) {
  res.cookie('token', token, { ...COOKIE_OPTIONS, maxAge: COOKIE_MAX_AGE });
}

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const { user, token } = await authService.signup({ name, email, password, role, phone });
  setAuthCookie(res, token);
  res.status(201).json({ user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  setAuthCookie(res, token);
  res.status(200).json({ user });
});

const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Logged out' });
};

const me = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.json({ user });
});

module.exports = { signup, login, logout, me };

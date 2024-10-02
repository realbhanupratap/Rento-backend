import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError('Not authorized, no token', 401);
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Find the user by ID
  req.user = await User.findById(decoded.id);
  
  if (!req.user) {
    throw new ApiError('No user found with this token', 404);
  }

  next();
});

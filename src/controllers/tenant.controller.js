import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tenant } from "../models/tenant.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetEmail } from "../utils/emailService.js";  // Assuming you have an email service set up

// Register a new tenant
const registerTenant = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some(field => !field?.trim())) {
    throw new ApiError("All fields are required", 400);
  }

  const existedUser = await Tenant.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError("User already exists", 409);
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError("Avatar upload failed", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdTenant = await Tenant.create({
    fullName,
    avatar: avatar.url,
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
  });

  const tenantResponse = await Tenant.findById(createdTenant._id).select("-password -refreshToken");

  return res.status(201).json(new ApiResponse(201, tenantResponse, "Tenant registered successfully"));
});

// Login a tenant
const loginTenant = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const tenant = await Tenant.findOne({ email });
  if (!tenant) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await tenant.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    tenant.incorrectLoginAttempts = (tenant.incorrectLoginAttempts || 0) + 1;

    if (tenant.incorrectLoginAttempts >= 5) {
      tenant.isLocked = true;
      await tenant.save();
      throw new ApiError("Account locked due to too many failed login attempts", 423);  // Locked status
    }

    await tenant.save();
    throw new ApiError("Invalid email or password", 401);
  }

  tenant.incorrectLoginAttempts = 0;  // Reset on successful login
  const accessToken = tenant.generateAccessToken();
  const refreshToken = tenant.generateRefreshToken();

  tenant.refreshToken = refreshToken;
  await tenant.save();

  return res.status(200).json(new ApiResponse(200, { accessToken, refreshToken }, "Login successful"));
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError('Current password and new password are required', 400);
  }

  // Fetch the tenant from the database
  const tenant = await Tenant.findById(req.user._id);

  if (!tenant) {
    throw new ApiError('User not found', 404);
  }

  // Compare current password with the stored hashed password
  const isMatch = await bcrypt.compare(currentPassword, tenant.password);
  if (!isMatch) {
    throw new ApiError('Current password is incorrect', 400);
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Update the tenant's password in the database
  tenant.password = hashedNewPassword;
  await tenant.save();

  return res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

// Reset Password (Step 1: Send reset link)
const sendPasswordResetLink = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError("Email is required", 400);
  }

  const tenant = await Tenant.findOne({ email });
  if (!tenant) {
    throw new ApiError("User with this email does not exist", 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  tenant.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  tenant.resetPasswordExpires = Date.now() + 3600000;  // 1 hour expiration
  await tenant.save();

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/tenants/reset-password/${resetToken}`;
  await sendResetEmail(tenant.email, resetUrl);  // Assume sendResetEmail is a function that handles the email

  return res.status(200).json(new ApiResponse(200, null, "Password reset link sent"));
});

// Reset Password (Step 2: Reset password)
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError("New password is required", 400);
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const tenant = await Tenant.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!tenant) {
    throw new ApiError("Token is invalid or has expired", 400);
  }

  tenant.password = await bcrypt.hash(newPassword, 10);
  tenant.resetPasswordToken = undefined;
  tenant.resetPasswordExpires = undefined;
  await tenant.save();

  return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});

// Logout tenant
const logoutTenant = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError("Refresh token is required", 400);
  }

  const tenant = await Tenant.findOneAndUpdate({ refreshToken: token }, { refreshToken: "" });

  if (!tenant) {
    throw new ApiError("User not found", 404);
  }

  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

export {
  registerTenant,
  loginTenant,
  changePassword,
  sendPasswordResetLink,
  resetPassword,
  logoutTenant
};

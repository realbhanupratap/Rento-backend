import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.models.js";

// Get notifications for a user
export const getNotifications = asyncHandler(async (req, res) => {
  const { userId, userType } = req.params;

  const notifications = await Notification.find({
    recipient: userId,
    recipientModel: userType
  }).sort({ createdAt: -1 });

  return res.status(200).json(notifications);
});

// Mark a notification as read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );

  return res.status(200).json(notification);
});

// Create a new notification (can be called from different modules like payment or complaint)
export const createNotification = asyncHandler(async (recipient, recipientModel, message, type) => {
  const notification = new Notification({
    recipient,
    recipientModel,
    message,
    type,
  });
  await notification.save();
});

export { getNotifications, markNotificationAsRead };
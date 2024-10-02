import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId, 
    refPath: 'recipientModel', // It can refer to either Tenant or Landlord
    required: true,
  },
  recipientModel: {
    type: String,
    enum: ['Tenant', 'Landlord'], // Either Tenant or Landlord
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Payment', 'Complaint', 'PropertyUpdate', 'Reminder'],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Notification = mongoose.model('Notification', notificationSchema);

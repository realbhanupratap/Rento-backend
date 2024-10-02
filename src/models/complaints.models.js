import mongoose, { Schema } from 'mongoose';

const complaintSchema = new Schema({
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'PropertyListing',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  status: {
    type: String,
    enum: ['Submitted', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Submitted',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export const Complaint = mongoose.model('Complaint', complaintSchema);

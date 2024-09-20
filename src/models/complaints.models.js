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
  },
  status: {
    type: String,
    enum: ['Submitted', 'In Progress', 'Resolved'],
    default: 'Submitted',
  },
}, {
  timestamps: true,
});

export const Complaint = mongoose.model('Complaint', complaintSchema);

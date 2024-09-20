import mongoose, { Schema } from 'mongoose';

const paymentHistorySchema = new Schema({
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
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paidDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Due', 'Paid', 'Overdue'],
    default: 'Due',
  },
}, {
  timestamps: true,
});

export const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

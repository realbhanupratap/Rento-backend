import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
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
  rating: {
    type: Number,  // Example: Rating from 1 to 5 stars
    required: true,
  },
  comment: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Review = mongoose.model('Review', reviewSchema);

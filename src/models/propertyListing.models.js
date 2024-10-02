import mongoose, { Schema } from 'mongoose';

const propertyListingSchema = new Schema({
  landlord: {
    type: Schema.Types.ObjectId,
    ref: 'Landlord',
    required: true,
  },
  propertyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  amenities: {
    type: [String],
  },
  photos: {
    type: [String],
  },
  description: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }
  ],
  available: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Add geospatial index to the coordinates field
propertyListingSchema.index({ coordinates: '2dsphere' });

export const PropertyListing = mongoose.model('PropertyListing', propertyListingSchema);

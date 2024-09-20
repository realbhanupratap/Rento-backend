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
  amenities: {
    type: [String],  // Example: ['Wi-Fi', 'AC', 'Parking']
  },
  photos: {
    type: [String],  // Array of image URLs
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
    default: true,  // Marks if the property is still available
  },
}, {
  timestamps: true,
});

export const PropertyListing = mongoose.model('PropertyListing', propertyListingSchema);

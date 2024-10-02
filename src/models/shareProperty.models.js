import mongoose, { Schema } from 'mongoose';

// Schema to track property sharing
const sharePropertySchema = new Schema({
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant', // Assuming only tenants can share properties
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'PropertyListing', // Referencing the property being shared
    required: true,
  },
  platform: {
    type: String,
    enum: ['Facebook', 'Twitter', 'Instagram', 'Email', 'WhatsApp'], // Social media or email
    required: true,
  },
  sharedAt: {
    type: Date,
    default: Date.now, // Automatically capture the time of sharing
  },
}, {
  timestamps: true,
});

export const ShareProperty = mongoose.model('ShareProperty', sharePropertySchema);

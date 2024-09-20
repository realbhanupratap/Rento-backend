import mongoose, { Schema } from 'mongoose';

const inventoryAccessSchema = new Schema({
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  inventoryItem: {
    type: Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  },
  accessStartDate: {
    type: Date,
    required: true,
  },
  accessEndDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

export const InventoryAccess = mongoose.model('InventoryAccess', inventoryAccessSchema);

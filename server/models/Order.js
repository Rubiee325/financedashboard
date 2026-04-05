const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, enum: ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'] },

  product: {
    type: String,
    required: true,
    enum: [
      'Fiber Internet 300 Mbps',
      '5GUnlimited Mobile Plan',
      'Fiber Internet 1 Gbps',
      'Business Internet 500 Mbps',
      'VoIP Corporate Package'
    ]
  },

  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number },

  // ✅ NEW FIELD (VERY IMPORTANT)
  type: {
    type: String,
    enum: ["income", "expense"],
    default: "expense"
  },

  status: { type: String, required: true, default: 'Pending', enum: ['Pending', 'In progress', 'Completed'] },

  createdBy: {
    type: String,
    required: true,
    enum: ['Mr. Michael Harris', 'Mr. Ryan Cooper', 'Ms. Olivia Carter', 'Mr. Lucas Martin']
  },

  duration: { type: Number, default: 0 }

}, { timestamps: true });

/* ================= PRE SAVE ================= */

orderSchema.pre('save', function() {

  this.totalAmount = this.quantity * this.unitPrice;

  // duration calc
  if (!this.isNew && this.createdAt && typeof this.createdAt.getTime === 'function') {
    const diff = Date.now() - this.createdAt.getTime();
    this.duration = Math.floor(diff / (1000 * 60 * 60 * 24));
  } else {
    this.duration = 0;
  }

});

module.exports = mongoose.model('Order', orderSchema);
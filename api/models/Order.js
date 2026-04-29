const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  address2: { type: String },
  country: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  sameAddress: { type: Boolean, default: true },
  saveInfo: { type: Boolean, default: false },
  paymentMethod: { type: String, required: true },
  ccName: { type: String, required: true },
  ccNumber: { type: String, required: true },
  ccExpiration: { type: String, required: true },
  ccCvv: { type: String, required: true },
  orderId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);

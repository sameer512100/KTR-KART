const mongoose = require('mongoose');
const { Schema } = mongoose;

const PushSubscriptionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  endpoint: { type: String, required: true, index: true },
  keys: {
    p256dh: { type: String },
    auth: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PushSubscription', PushSubscriptionSchema);

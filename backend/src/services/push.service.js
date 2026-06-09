const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');
const env = require('../config/env');

if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(`mailto:${env.SUPPORT_EMAIL || 'support@example.com'}`, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
  } catch (e) {
    console.warn('web-push: failed to set VAPID details', e && e.message);
  }
} else {
  console.warn('web-push: VAPID keys not configured. Push disabled.');
}

const saveSubscription = async (userId, subscription) => {
  const existing = await PushSubscription.findOne({ user: userId, endpoint: subscription.endpoint });
  if (existing) {
    existing.keys = subscription.keys || existing.keys;
    await existing.save();
    return existing;
  }
  return PushSubscription.create({ user: userId, endpoint: subscription.endpoint, keys: subscription.keys });
};

const removeSubscription = async (userId, endpoint) => {
  await PushSubscription.deleteOne({ user: userId, endpoint });
};

const sendPushToUser = async (userId, payload) => {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) {
    // no-op if not configured
    return { sent: 0 };
  }

  const subs = await PushSubscription.find({ user: userId }).lean();
  if (!subs || subs.length === 0) return { sent: 0 };

  let sent = 0;
  await Promise.all(subs.map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify(payload));
      sent++;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await PushSubscription.deleteOne({ _id: s._id });
      }
    }
  }));

  return { sent };
};

module.exports = { saveSubscription, removeSubscription, sendPushToUser };

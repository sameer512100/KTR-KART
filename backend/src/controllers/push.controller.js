const { saveSubscription, removeSubscription, sendPushToUser } = require('../services/push.service');
const { auth } = require('../middlewares/auth.middleware');

const subscribe = async (req, res) => {
  try {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });
    await saveSubscription(req.user._id, subscription);
    return res.json({ success: true });
  } catch (err) {
    console.error('push.subscribe error', err);
    return res.status(500).json({ error: 'Failed to save subscription' });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) return res.status(400).json({ error: 'endpoint required' });
    await removeSubscription(req.user._id, endpoint);
    return res.json({ success: true });
  } catch (err) {
    console.error('push.unsubscribe error', err);
    return res.status(500).json({ error: 'Failed to remove subscription' });
  }
};

// convenience test endpoint: sends a test push to the authenticated user
const testPush = async (req, res) => {
  try {
    const { payload } = req.body;
    const result = await sendPushToUser(req.user._id, payload || { title: 'KTR-KART', body: 'Test notification' });
    return res.json({ success: true, result });
  } catch (err) {
    console.error('push.testPush error', err);
    return res.status(500).json({ error: 'Failed to send test push' });
  }
};

module.exports = { subscribe, unsubscribe, testPush };

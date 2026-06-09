const express = require('express');
const { subscribe, unsubscribe, testPush } = require('../controllers/push.controller');
const { auth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/subscribe', auth, subscribe);
router.post('/unsubscribe', auth, unsubscribe);
router.post('/test', auth, testPush);

module.exports = router;

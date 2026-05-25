const express = require("express");
const { initiateSignup, verifySignup, signin, me, updateProfile } = require("../controllers/auth.controller");
const { auth } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/signup/initiate", initiateSignup);
router.post("/signup/verify", verifySignup);
router.post("/signin", signin);
router.get("/me", auth, me);
router.put("/profile", auth, upload.single("profilePhoto"), updateProfile);

module.exports = router;

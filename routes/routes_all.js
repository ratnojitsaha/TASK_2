const express = require("express");
const {
  registerUser,
  loginUser,
  PasswordReset,
} = require("../validation/userController");

const router = express.Router();

router.use(express.json());

// User registration endpoint
router.post("/register", async (req, res) => {
  try {
    const message = await registerUser(req.body);
    res.status(201).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User login endpoint
router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Password reset endpoint
router.post("/forgot-password", async (req, res) => {
  try {
    const result = PasswordReset(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

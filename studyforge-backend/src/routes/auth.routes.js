import { User } from "../models/user.model.js";
import { Router } from "express";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = new User({ email, name });
    user.password = password; // triggers hashing
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "email already exists" });
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ error: "invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "invalid email or password" });
    }
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;

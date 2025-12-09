import { Router } from "express";
import { User } from "../models/user.model.js";
import mongoose, { Types } from "mongoose";

const router = Router();

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid user id" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid user id" });
    }
    const { name, plan } = req.body;

    const update = {};
    if (typeof name === "string") update.name = name.trim();
    if (plan !== undefined) {
      const allowed = ["free", "pro"];
      if (!allowed.includes(plan)) {
        return res.status(400).json({ error: 'plan must be "free" or "pro"' });
      }
      update.plan = plan;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "nothing to update" });
    }

    const user = await User.findByIdAndUpdate(id, update, {
      new: true, // return updated doc
      runValidators: true, // apply schema validators
    });
    if (!user) return res.status(404).json({ error: "user not found" });

    res.json(user); // toJSON already hides passwordHash
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid user id" });
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    const user = new User({ email, name });
    user.password = password; // triggers bcrypt hashing via pre('save')
    await user.save();

    return res.status(201).json(user); // to JSON strips passwordHash
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "email already exixst" });
    }
    next(error);
  }
});

export default router;

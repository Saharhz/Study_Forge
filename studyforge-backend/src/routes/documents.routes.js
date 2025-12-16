import { Router } from "express";
import { Types } from "mongoose";
import { Document } from "../models/document.model.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
      }
      filter.userId = userId;
    }

    const docs = (await Document.find(filter)).sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid document id" });
    }
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ error: "document not found" });
    res.json(doc);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { userId, title, sourceType, sourceUrl, storageKey, status, meta } =
      req.body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "valid userId is required" });
    }
    // The trim() method removes whitespace from both sides of a string and The trim() method removes whitespace from both sides of a string.
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }
    if (!sourceType || !["pdf", "url"].includes(sourceType)) {
      return res
        .status(400)
        .json({ error: "sourceType must be 'pdf' or 'url'" });
    }
    if (sourceType === "url" && (!sourceUrl || typeof sourceUrl !== "string")) {
      return res
        .status(400)
        .json({ error: "sourceUrl is required when sourceType = 'url'" });
    }
    if (
      sourceType === "pdf" &&
      (!storageKey || typeof storageKey !== "string")
    ) {
      return res
        .status(400)
        .json({ error: "storageKey is required when sourcetype = 'pdf'" });
    }

    const doc = await Document.create({
      userId,
      title: title.trim(),
      sourceType,
      sourceUrl,
      storageKey,
      status, // optional; defaults to 'queued' in schema
      meta, // optional
    });

    return res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
});

export default router;

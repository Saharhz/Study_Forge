import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;

try {
  await connectDB();
  app.listenerCount(port, () =>
    console.log(`Server running on http://localhost:${port}`)
  );
} catch (error) {
  console.error("failed to start:", error);
  process.exit(1);
}

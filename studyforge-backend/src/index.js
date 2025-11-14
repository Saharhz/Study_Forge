import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/user.routes.js";

const app = express();

console.log("🔍 Loaded MONGO_URI =", process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

const port = process.env.PORT || 4000;

try {
  await connectDB();
  app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
  );
} catch (error) {
  console.error("failed to start:", error);
  process.exit(1);
}

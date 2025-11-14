import mongoose from "mongoose";

export async function connectDB(uri) {
  const connStr = uri ?? process.env.MONGO_URI;
  if (!connStr || connStr.trim() === "") {
    throw new Error("MONGO URI is not set");
  }
  mongoose.set("strictQuery", true);

  await mongoose.connect(connStr, {
    autoIndex: true,
  });

  console.log("MongoDB connected");
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
}

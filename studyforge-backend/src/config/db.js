import mongoose from "mongoose";

async function connectDB(uri = process.env.Mongo_URI) {
  if (!uri) throw new Error("'MONGO URI is not set");
  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  console.log("MongoDB connected");
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
}

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

// environment variables are always string in Node.js
// parseInt convert the string "12" to number 12
// , 10 to tells parseInt to read the string in decimal, just to specify for clarity and safety
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "12", 10);

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    name: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    roles: {
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
  },
  { timestamps: true }
);

// Virtual field: never saved; used to accept raw password safely
UserSchema.virtual('password').set(function (password) {
    this._password = password. // temp field (not persisted)
});

// hide internal fields on JSON
UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id; // Replace `_id` with a friendlier `id`
    delete ret._id; // Remove the raw MongoDB `_id` field
    delete ret.__v; // Remove Mongoose’s internal version key
    delete ret.passwordHash; // Never send passwords in API responses
    return ret; // Return the cleaned object
  },
});

export const User = model("User", UserSchema);

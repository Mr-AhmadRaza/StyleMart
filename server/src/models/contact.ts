// server/src/models/contact.ts

import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt automatically
);

export default mongoose.model("Contact", contactSchema);
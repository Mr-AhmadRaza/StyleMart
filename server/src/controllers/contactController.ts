// server/src/controllers/contactController.ts

import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Contact from "../models/contact";

export const sendContactMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    // ── Basic validation ──────────────────────
    if (!name || !email || !message) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // ── Step 1: Save to MongoDB ───────────────
    await Contact.create({ name, email, message });
    // Now you can see all messages in your DB!

    // ── Step 2: Send Email via Nodemailer ─────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your gmail
        pass: process.env.GMAIL_PASS, // your app password
      },
    });

    await transporter.sendMail({
      from: `"StyleMart Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,   // sends TO yourself
      subject: `New Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
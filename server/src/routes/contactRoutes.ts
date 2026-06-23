// server/src/routes/contactRoutes.ts

import express from "express";
import { sendContactMessage } from "../controllers/contactController";

const router = express.Router();

// POST /api/contact → sendContactMessage
router.post("/", sendContactMessage);

export default router;
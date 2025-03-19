/* eslint-disable @typescript-eslint/no-require-imports */
import { importChat } from "../controllers/chatController";
import authMiddleware from "../middlewares/authMiddleware";
import multer from "multer";
const express = require("express");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/import", authMiddleware, upload.single("file"), importChat);

export default router;

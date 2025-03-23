/* eslint-disable @typescript-eslint/no-require-imports */
import { importChat } from "../controllers/chatController";
import authMiddleware from "../middlewares/authMiddleware";
import multer from "multer";
import { validateImportChat } from "../middlewares/validateImportChat";

const express = require("express");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/import",
  authMiddleware,
  upload.single("file"),
  validateImportChat,
  importChat
);

export default router;

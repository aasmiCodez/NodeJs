import { importChat } from "../controllers/chatController";
import authMiddleware from "../middlewares/authMiddleware";

const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.post("/import", authMiddleware, upload.single("file"), importChat);

export default router;
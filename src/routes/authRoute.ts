/* eslint-disable @typescript-eslint/no-require-imports */
import { login, register } from "../controllers/authController";
const express = require("express");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;

/* eslint-disable @typescript-eslint/no-require-imports */
import { login, register } from "../controllers/authController";
const express = require("express");
const router = express.Router();
import { validateRequestBody } from "zod-express-middleware";
import authSchema from "../schema/authSchema";

router.post("/register", register);
router.post("/login", validateRequestBody(authSchema.registerSchema), login);

export default router;

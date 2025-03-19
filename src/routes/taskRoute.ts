/* eslint-disable @typescript-eslint/no-require-imports */
import { getTasks } from "../controllers/taskController";
const express = require("express");
const router = express.Router();
router.get("/tasks", getTasks);

export default router;

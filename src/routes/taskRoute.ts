/* eslint-disable @typescript-eslint/no-require-imports */
import { getTasks } from "../controllers/taskController";
import { validateTaskQuery } from "../middlewares/validateTaskQuery";

const express = require("express");
const router = express.Router();

router.get("/tasks", validateTaskQuery, getTasks);

export default router;

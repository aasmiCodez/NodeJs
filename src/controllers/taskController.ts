import { Request, Response } from "express";
import prisma from "../config/database";
import logger from "../utils/logger";
import { Task } from "../types/task";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { filter } = req.query;
    let where = {};

    if (filter === Task.Completed) where = { status: Task.Completed };
    if (filter === Task.Pending) where = { status: Task.Pending };

    logger.info(`Fetching tasks with filter: ${filter || "all"}`);

    const tasks = await prisma.task.findMany({ where });

    logger.info(
      `Found ${tasks.length} tasks matching filter: ${filter || "all"}`
    );

    return res.json(tasks);
  } catch (error) {
    logger.error(`Error fetching tasks: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

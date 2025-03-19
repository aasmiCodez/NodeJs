import { Request, Response } from "express";
import prisma from "../config/database";

export const getTasks = async (req: Request, res: Response) => {
  const { filter } = req.query;
  let where = {};
  if (filter === "completed") where = { status: "completed" };
  if (filter === "pending") where = { status: "pending" };
  const tasks = await prisma.task.findMany({ where });
  res.json(tasks);
};

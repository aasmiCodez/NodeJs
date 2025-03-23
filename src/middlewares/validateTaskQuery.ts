import { Request, Response, NextFunction } from "express";
import taskSchema from "../schema/taskSchema";
import httpStatus from "http-status";

export const validateTaskQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = taskSchema.getTasksSchema.safeParse(req.query);

  if (!validation.success) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ errors: validation.error.format() });
  }

  next();
};

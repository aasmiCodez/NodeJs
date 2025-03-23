import { Request, Response, NextFunction } from "express";
import chatSchema from "../schema/chatSchema";
import httpStatus from "http-status";

export const validateImportChat = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "No file uploaded" });
  }

  const isExcel =
    req.file.mimetype ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  if (!isExcel) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({
        message: "Invalid file type. Please upload an Excel (.xlsx) file.",
      });
  }

  const validation = chatSchema.importChatSchema.safeParse({
    file: req.file.buffer,
  });

  if (!validation.success) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ errors: validation.error.format() });
  }

  next();
};

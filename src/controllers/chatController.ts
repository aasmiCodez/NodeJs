import { Request, Response } from "express";
import prisma from "../config/database";
import httpStatus from "http-status";
import ExcelJS from "exceljs";
import logger from "../utils/logger";

export const importChat = async (req: Request, res: Response) => {
  if (!req.file) {
    logger.warn("No file uploaded in importChat request");
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "No file uploaded" });
  }

  try {
    logger.info("Processing uploaded Excel file...");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      logger.warn("Invalid Excel file format");
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid Excel file format" });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userID = (req as any).user.id.toString();
    const chatData: { userId: string; content: string }[] = [];

    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      if (rowNumber === 1) return; // Skip header row

      const message = row.getCell(1).value?.toString().trim();
      if (message) {
        chatData.push({ userId: userID, content: message });
      }
    });

    if (chatData.length === 0) {
      logger.warn(`No valid chat data found for user ID: ${userID}`);
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "No valid chat data found" });
    }

    await prisma.chat.createMany({ data: chatData });

    logger.info(
      `Chat imported successfully for user ID: ${userID}, Records: ${chatData.length}`
    );

    return res.status(httpStatus.OK).json({
      message: "Chat imported successfully",
      imported: chatData.length,
    });
  } catch (error) {
    logger.error(`Error importing chat: ${error}`);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

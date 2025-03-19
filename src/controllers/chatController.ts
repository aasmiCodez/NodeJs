import { Request, Response } from "express";
import prisma from "../config/database";
import httpStatus = require("http-status");
import ExcelJS = require("exceljs");

export const importChat = async (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "No file uploaded" });
  }
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid Excel file format" });
    }

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
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "No valid chat data found" });
    }

    await prisma.chat.createMany({ data: chatData });

    return res.status(httpStatus.OK).json({
      message: "Chat imported successfully",
      imported: chatData.length,
    });
  } catch (error) {
    console.error("Error importing chat:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

import { Request, Response } from "express";
const ExcelJS = require("exceljs");
import prisma from "../config/database";
import httpStatus = require("http-status");

export const importChat = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "No file uploaded" });
  }
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Excel file format" });
    }

    const userID = (req as any).user.id;
    const chatData: { userId: number; content: string }[] = [];

    worksheet.eachRow((row: any, rowNumber: number) => {
      if (rowNumber === 1) return;
      const message = row.getCell(1).value?.toString().trim();
      if (message) {
        chatData.push({ userId: userID, content: message });
      }
    });

    if (chatData.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "No valid chat data found" });
    }

    await prisma.chat.createMany({ data: chatData }); // Batch insertion for better performance

    return res
      .status(httpStatus.OK)
      .json({
        message: "Chat imported successfully",
        imported: chatData.length,
      });
  } catch (error) {
    console.error("Error importing chat:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

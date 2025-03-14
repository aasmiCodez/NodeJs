import { Request, Response } from "express";
const xlsx = require("xlsx");
import prisma from "../config/database";

export const importChat = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (data.length === 0) {
      const userID = (req as any).user.id;
      for (const row of data) {
        await prisma.chat.create({
          data: {
            userId: userID,
            content: row["Message"],
          },
        });
      }
      return res.status(200).json({ message: "Chat imported successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

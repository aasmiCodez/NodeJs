/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import ExcelJS from "exceljs";
import { importChat } from "../../controllers/chatController";
import logger from "../../utils/logger";
import prisma from "../../config/database";

jest.mock("../../config/database", () => ({
  chat: {
    createMany: jest.fn(),
  },
}));

jest.mock("../../utils/logger");

describe.skip("importChat", () => {
  let mockReq: any;
  let mockRes: any;
  let mockWorkbook: ExcelJS.Workbook;
  let mockWorksheet: Partial<ExcelJS.Worksheet>;

  beforeEach(() => {
    mockReq = {
      file: {
        buffer: Buffer.from("mock file data"),
      },
      user: { id: "123" },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockWorkbook = new ExcelJS.Workbook();
    

    mockWorksheet = {
      eachRow: ((callback: (row: ExcelJS.Row, rowNumber: number) => void) => {
        callback(
          {
            getCell: () => ({ value: "Hello" }),
          } as unknown as ExcelJS.Row, 
          2
        );
      }) as unknown as ExcelJS.Worksheet["eachRow"],
    };


    mockWorkbook.worksheets = [mockWorksheet as ExcelJS.Worksheet];

    jest.spyOn(ExcelJS.Workbook.prototype.xlsx, "load").mockResolvedValue(mockWorkbook);


    jest.clearAllMocks();
  });

  it("should return 400 if no file is uploaded", async () => {
    mockReq.file = null;

    await importChat(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "No file uploaded" });
    expect(logger.warn).toHaveBeenCalledWith("No file uploaded in importChat request");
  });

  it("should return 400 for an invalid Excel file", async () => {
    mockWorkbook.worksheets = [];

    await importChat(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid Excel file format" });
    expect(logger.warn).toHaveBeenCalledWith("Invalid Excel file format");
  });

  it("should return 400 if no valid chat data is found", async () => {
    mockWorksheet.eachRow = ((cb: (row: ExcelJS.Row, rowNumber: number) => void) => {
      cb({ getCell: () => ({ value: null }) } as unknown as ExcelJS.Row, 2);
    }) as unknown as ExcelJS.Worksheet["eachRow"];

    await importChat(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "No valid chat data found" });
    expect(logger.warn).toHaveBeenCalledWith("No valid chat data found for user ID: 123");
  });

  it("should return 200 on successful chat import", async () => {
    (prisma.chat.createMany as jest.Mock).mockResolvedValue({ count: 1 });

    await importChat(mockReq, mockRes);

    expect(prisma.chat.createMany).toHaveBeenCalledWith({ data: [{ userId: "123", content: "Hello" }] });
    expect(mockRes.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Chat imported successfully", imported: 1 });
    expect(logger.info).toHaveBeenCalledWith("Chat imported successfully for user ID: 123, Records: 1");
  });

  it("should return 500 if an error occurs", async () => {
    (prisma.chat.createMany as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await importChat(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error importing chat:"));
  });
});

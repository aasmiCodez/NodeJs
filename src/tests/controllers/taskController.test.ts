import { Request, Response } from "express";
import prisma from "../../config/database";
import { getTasks } from "../../controllers/taskController";
import logger from "../../utils/logger";
import { Task } from "../../types/task";

jest.mock("../../config/database", () => ({
  task: {
    findMany: jest.fn(),
  },
}));

jest.mock("../../utils/logger");

describe("getTasks", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should return all tasks if no filter is provided", async () => {
    const mockTasks = [{ id: 1, status: "completed" }, { id: 2, status: "pending" }];
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

    await getTasks(mockReq as Request, mockRes as Response);

    expect(prisma.task.findMany).toHaveBeenCalledWith({ where: {} });
    expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    expect(logger.info).toHaveBeenCalledWith("Fetching tasks with filter: all");
    expect(logger.info).toHaveBeenCalledWith("Found 2 tasks matching filter: all");
  });

  it("should return completed tasks when filter is 'completed'", async () => {
    mockReq.query = { filter: Task.Completed };

    const mockTasks = [{ id: 1, status: Task.Completed }];
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

    await getTasks(mockReq as Request, mockRes as Response);

    expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { status: Task.Completed } });
    expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    expect(logger.info).toHaveBeenCalledWith("Fetching tasks with filter: completed");
    expect(logger.info).toHaveBeenCalledWith("Found 1 tasks matching filter: completed");
  });

  it("should return pending tasks when filter is 'pending'", async () => {
    mockReq.query = { filter: Task.Pending };

    const mockTasks = [{ id: 2, status: Task.Pending }];
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

    await getTasks(mockReq as Request, mockRes as Response);

    expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { status: Task.Pending } });
    expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    expect(logger.info).toHaveBeenCalledWith("Fetching tasks with filter: pending");
    expect(logger.info).toHaveBeenCalledWith("Found 1 tasks matching filter: pending");
  });

  it("should return 500 if a database error occurs", async () => {
    (prisma.task.findMany as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await getTasks(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error fetching tasks:"));
  });
});

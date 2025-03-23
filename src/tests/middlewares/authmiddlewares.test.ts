/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import authMiddleware from "../../middlewares/authMiddleware";
import logger from "../../utils/logger";

jest.mock("jsonwebtoken");
jest.mock("../../utils/logger");

describe("authMiddleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { header: jest.fn() };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", () => {
    (mockReq.header as jest.Mock).mockReturnValue(null);

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Access Denied" });
    expect(logger.warn).toHaveBeenCalledWith(
      "Unauthorized access attempt - No token provided"
    );
  });

  it("should return 400 if token is invalid", () => {
    (mockReq.header as jest.Mock).mockReturnValue("Bearer invalidToken");
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid Token" });
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Invalid Token"));
  });

  it("should call next() if token is valid", () => {
    const mockDecoded = { id: "123", email: "test@example.com" };
    (mockReq.header as jest.Mock).mockReturnValue("Bearer validToken");
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect((mockReq as any).user).toEqual(mockDecoded);
    expect(logger.info).toHaveBeenCalledWith(
      `User authenticated: ${JSON.stringify(mockDecoded)}`
    );
    expect(mockNext).toHaveBeenCalled();
  });
});

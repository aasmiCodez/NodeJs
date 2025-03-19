import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import httpStatus from "http-status";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    logger.warn("Unauthorized access attempt - No token provided");
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = decoded;
    
    logger.info(`User authenticated: ${JSON.stringify(decoded)}`);
    
    next();
  } catch (error) {
    logger.error(`Invalid Token ${error}`);
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid Token" });
  }
};

export default authMiddleware;

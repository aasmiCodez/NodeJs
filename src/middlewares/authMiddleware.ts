import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import httpStatus from "http-status";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Unauthorized access attempt - No token provided");
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Access Denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    req.user = decoded; // Store decoded token in `req.user`

    logger.info(`User authenticated: ${JSON.stringify(decoded)}`);
    next();
  } catch (error) {
    logger.error(`Invalid Token: ${error}`);

    const errorMessage =
      error instanceof jwt.TokenExpiredError
        ? "Token Expired"
        : "Invalid Token";

    return res.status(httpStatus.UNAUTHORIZED).json({ message: errorMessage });
  }
};

export default authMiddleware;

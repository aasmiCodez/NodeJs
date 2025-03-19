const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
import httpStatus = require("http-status");
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Access Denied" });
    } 
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Token" });
    }
};

export default authMiddleware;
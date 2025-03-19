import { Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import logger from "../utils/logger";
const bcrypt = require("bcrypt");

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    logger.info(`Register request received for email: ${email}`);

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    logger.info(`User registered successfully: ${user.email}`);
    res.status(httpStatus.CREATED).json(user);
  } catch (error) {
    logger.error(`Error in register: ${error}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(`Invalid login attempt for email: ${email}`);
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    logger.info(`User logged in successfully: ${email}`);
    res.status(httpStatus.OK).json({ token });
  } catch (error) {
    logger.error(`Error in login:${error}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error" });
  }
};

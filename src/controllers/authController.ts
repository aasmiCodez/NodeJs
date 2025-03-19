import { Request, Response } from "express";
const bcrypt = require("bcrypt");
import prisma from "../config/database";
import httpStatus = require("http-status");
const jwt = require("jsonwebtoken");

export const register = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashPassword
        }
    })
    res.json(user);
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({where: {email}});
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {expiresIn: "ih"});
    }
import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../config/database";

// ✅ Mock Prisma
jest.mock("../../config/database", () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

// ✅ Mock bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// ✅ Mock JWT
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe.skip("Auth Routes", () => {
  describe("POST /register", () => {
    it("should register a new user", async () => {
      const mockUser = { email: "test@example.com", password: "hashedPassword" };
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 400 if user already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      });

      const response = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /login", () => {
    it("should log in an existing user", async () => {
      const mockUser = { id: 1, email: "test@example.com", password: "hashedPassword" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockImplementation((pass, hash) => {
        return Promise.resolve(hash === "hashedPassword"); // Simulate correct password check
      });

      (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe("fake-jwt-token");
    });

    it("should return 401 for invalid credentials", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post("/api/auth/login").send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Credentials");
    });
  });
});

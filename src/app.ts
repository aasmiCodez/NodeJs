import authRoute from "./routes/authRoute";
import chatRoute from "./routes/chatRoute";
import taskRoute from "./routes/taskRoute";
import cors from "cors";
import express from "express";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);
app.use("/api/chat", chatRoute);

export default app;

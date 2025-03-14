import authRoute from "./routes/authRoute";
import chatRoute from "./routes/chatRoute";
import taskRoute from "./routes/taskRoute";

const express = require("express");
const cros = require("cors");


const app = express()
app.use(cros());
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/task", taskRoute);
app.use("/api/chat", chatRoute);

export default app
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./server/mongodb.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import patientRouter from "./routes/patientRoute.js";
import pharmacyRouter from "./routes/pharmacyRoute.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

connectDB();

const allowedOrigins = [process.env.FRONTEND_PORT];

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Real-time socket connection & room management
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-patient-room", (patientCustomId) => {
    if (patientCustomId && typeof patientCustomId === "string") {
      socket.join(patientCustomId);
      console.log(`Patient joined socket room: ${patientCustomId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Attach 'io' instance globally to Express
app.set("io", io);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API Endpoints
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);
app.use("/api/pharmacy", pharmacyRouter);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
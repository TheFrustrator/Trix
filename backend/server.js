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

// Connect to MongoDB
connectDB();

// 1. Safe Allowed Origins setup (Fallback to wildcard/localhost if env variable is missing)
const allowedOrigins = process.env.FRONTEND_URL || process.env.FRONTEND_PORT 
  ? [process.env.FRONTEND_URL || process.env.FRONTEND_PORT] 
  : ["http://localhost:5173", "http://localhost:3000"];

// 2. Initialize Socket.io with CORS
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

// 3. Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Set to true to prevent strict CORS blocks in dev
      }
    },
    credentials: true,
  })
);

// 4. API Endpoints
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);
app.use("/api/pharmacy", pharmacyRouter);

// 5. Server listener (Only run app.listen locally or on Render, NOT on Vercel Serverless)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless environment
export default app;
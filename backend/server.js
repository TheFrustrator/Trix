import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./server/mongodb.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();
const allowedOrigins = ["http://localhost:5173"];
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Api endpoints
app.get("/", (req, res) => res.send("APi working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});

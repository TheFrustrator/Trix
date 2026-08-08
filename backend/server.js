import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./server/mongodb.js";
import authRouter from './routes/authRoute.js'

const app = express();

const PORT = process.env.PORT || 4000;

connectDB()

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// Api endpoints
app.get('/', (req, res) => res.send("APi working"));
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});

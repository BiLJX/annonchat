import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { ApiRoutes } from "routes/main.routes";
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));
app.use("/api", ApiRoutes);
async function main(){
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB");
    console.log("Listening on port...", PORT);
}

app.listen(PORT, main)
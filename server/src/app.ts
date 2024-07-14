import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { ApiRoutes } from "routes/main.routes";
import { v2 as cloudinary } from 'cloudinary';
import { Server, Socket } from "socket.io";
import { User } from "models/User.model";
import jwt from "jsonwebtoken";
import { SocketEvents } from "@shared/sockets/socketEvents.type"
import { matchHandler } from "handlers/match.handler";
import { redis } from "lib/redis";
import { chatHandler } from "handlers/chat.handler";
import { callMatchHandler } from "handlers/call.handler";
import path from "path"

const PORT = process.env.PORT || 4000;
const app = express();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true,  }));
app.use(express.static(path.join("dist")))

app.use("/api", ApiRoutes);



app.get("/*", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"))
})

console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI || "").then(main);



async function main(){
    console.log("Connected to MongoDB");
    console.log("Connecting to Redis...");
    await redis.connect();
    console.log("Connected to Redis");
    console.log("Starting Server...")
    const server = app.listen(PORT, ()=>{
        console.log("Listening on port...", PORT);
    });

    
    const io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true,
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = <string>socket.handshake.query.token;
            if (!token) return next(new Error("Not Authorized"));
            const { user_id }: any = jwt.verify(token, process.env.USER_SESSION_JWT||"");
            const user = await User.findOne({ user_id });
            if (!user) return next(new Error("Not Authorized"));
            socket.user_id = user.user_id;
            return next();
        } catch (error) {
            console.log(error);
        }
    })
    io.on(SocketEvents.CONNECT, socket=>{
        socket.join(socket.user_id);
        matchHandler(io, socket);
        chatHandler(io, socket);
        callMatchHandler(io, socket)
    })
}


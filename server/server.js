import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server} from "socket.io";
import { log } from "console";

// Create Express app and Http server
const app = express();
const server = http.createServer(app);

// Initialise socket.io server
export const io = new Server(server, {
  cors: {origin: "*"}
});

// Store online users
export const userSocketMap = {}; // {userId : socketId}

// Socket.io connection handler
io.on("connection", (socket)=>{
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  if(userId){
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all connected client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", ()=>{
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// ADDED CODE: Handles GET requests to the root path
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Test route
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
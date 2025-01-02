import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/AuthRoute.js";
import contactsRoutes from "./routes/ContactsRoute.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import channelRoutes from "./routes/ChannelRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4500;
const databaseURL = process.env.DATABASE_URL;

// Parse multiple origins from the environment variable
const allowedOrigins = process.env.ORIGIN.split(',');

// Configure CORS dynamically based on origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow cookies or authentication tokens
}));

// Serve static files for profile images and file uploads
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Setup WebSocket functionality
setupSocket(server);

// Connect to MongoDB
mongoose.connect(databaseURL)
  .then(() => console.log(`DB Connection Successful`))
  .catch((err) => console.log(`DB Connection Error: ${err.message}`));

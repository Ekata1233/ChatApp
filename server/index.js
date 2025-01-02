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

dotenv.config();
const app = express();
const port = process.env.PORT || 4500;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}))

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use ("/uploads/files",express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/contacts",contactsRoutes)
app.use("/api/messages",messagesRoutes)
app.use('/api/channel',channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  setupSocket (server)

mongoose.connect(databaseURL).then(()=>console.log(`DB Connection Successfull`)).catch((err)=>console.log(err.message))

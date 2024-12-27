import {Router} from 'express'
import {verifyToken} from '../middlewares/AuthMiddleware.js';
import { deleteChatMessages, deleteForEveryone, deleteMessage, getMessages, uploadFile } from '../controllers/MessagesController.js';
import multer from "multer"

const messagesRoutes=Router();
const upload = multer({dest:"uploads/files"})

messagesRoutes.post("/get-messages",verifyToken,getMessages);
messagesRoutes.post(
    "/upload-file",
    verifyToken,
    upload.single("file"),
    uploadFile)

    messagesRoutes.post("/delete-messages", verifyToken, deleteChatMessages);

    messagesRoutes.post("/delete-msg",verifyToken,deleteMessage)

    messagesRoutes.post("/delete-everyone",verifyToken,deleteForEveryone)
export default messagesRoutes

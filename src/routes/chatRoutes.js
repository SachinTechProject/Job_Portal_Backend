// backend/routes/chatRoutes.js
import { Router } from "express";
import { sendMessage } from "../controller/chatController.js";


const router = Router();

router.post("/chat", sendMessage);

export default router;
import { Router } from "express";
import passport from "passport";

import storageChat from "../libs/multer";

const router = Router();

import { sendImagenChat } from "../controllers/chat.controller";

router.post("/chats", storageChat.single("imagen"), sendImagenChat);

export default router;

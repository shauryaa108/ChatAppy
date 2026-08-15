import express from "express";
import mongoose from "mongoose";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { isValidObjectId } from "mongoose";
import ApiError from "../utils/apiError.js";

function validateObjectId(paraName){
    return (req,res,next)=>{
        const val = req.params[paraName];
        if(!mongoose.Types.ObjectId.isValid(val)){
            return res.status(400).json({message : "Invalid user id"})
        }
        next();
    }
}

const router = express.Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id",validateObjectId("id") , getMessagesByUserId);
router.post("/send/:id",validateObjectId("id"), sendMessage);

export default router;
import express from 'express'
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { auth_user } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.patch("/updateProfile",auth_user, updateProfile);

// method to use in frontend when page refresh to validate the user and it's current session
router.get("/check", auth_user, (req,res)=>res.status(200).json(req.user))

export default router
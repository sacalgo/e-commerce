import express from "express";
const router = express.Router();
import { authUser, getUserProfile } from "../controllers/userController.js";
import {errorHandler} from '../middleware/errorMiddleware.js'
import protect from '../middleware/authMiddleware.js'


router.post("/login", authUser);
router.route("/profile").get(  getUserProfile);

export default router;

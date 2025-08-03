import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getProfile, login, logout, register } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", isAuthenticated, getProfile);
router.get("/logout", logout);

export default router;

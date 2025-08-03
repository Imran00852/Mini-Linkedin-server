import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostsByUser,
  getSinglePost,
} from "../controllers/post.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createPost); //new post
router.get("/all", getAllPosts); //get all posts
router.get("/me", isAuthenticated, getPostsByUser); //get all posts by user
router.get("/:id", getSinglePost); //get single post by id
router.delete("/:id", isAuthenticated, deletePost); //delete post by id

export default router;

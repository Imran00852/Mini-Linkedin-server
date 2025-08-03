import { Post } from "../models/post.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const trimmedContent = content?.trim();
    if (!trimmedContent || trimmedContent.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Post content cannot be empty",
      });
    }
    const post = await Post.create({
      content: trimmedContent,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      msg: "Post created successfully!",
      post,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error",
    });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Post ID is required",
      });
    }
    const post = await Post.findById(id).populate("user", "username email");
    if (!post) {
      return res.status(404).json({
        success: false,
        msg: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error",
    });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: req.user._id })
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Post ID is required",
      });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        msg: "Post not found",
      });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: "You are not authorized to delete this post",
      });
    }
    await post.deleteOne();
    res.status(200).json({
      success: true,
      msg: "Post deleted successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error",
    });
  }
};

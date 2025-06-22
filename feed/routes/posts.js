const express = require("express");

const router = express.Router();

const { createPost } = require("../controllers/posts");
const { getAllPosts } = require("../controllers/posts");
const { deletePost } = require("../controllers/posts");
const { toggleLike } = require("../controllers/posts");
const { getPostById } = require("../controllers/posts");

router.post("/create-post", createPost);

router.get("/get-all-posts", getAllPosts);

router.delete("/delete-post/:postId", deletePost);

router.get("/:postId", getPostById);

router.put("/like/:postId", toggleLike);





module.exports = router;

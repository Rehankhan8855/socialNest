const express = require("express");

const router = express.Router();

const { createPost } = require("../controllers/posts");
const { getAllPosts } = require("../controllers/posts");

router.post("/create-post", createPost);

router.get("/get-all-posts", getAllPosts);

module.exports = router;

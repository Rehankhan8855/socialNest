const Post = require("../model/posts");

const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    console.log(userId, description);

    const post = new Post({
      userId,
      description,
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createPost: createPost,
  getAllPosts: getAllPosts,
};

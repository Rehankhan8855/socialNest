const Post = require("../model/posts");

const createPost = async (req, res) => {
  console.log("BODY RECEIVED =>", req.body);
  try {
    const { userId, description} = req.body;
    console.log(userId, description);

    const newPost = await Post.create({
     userId,
      description,
    });

    // await newPost.save();
    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.error("CREATE POST ERROR =>", error); 
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error("GET ALL POSTS ERROR =>", error); 
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE POST ERROR =>", error); 
    res.status(500).json({ error: "Internal server error" });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ message: "Toggled like", likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error });
  }
};




const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost: createPost,
  getAllPosts: getAllPosts,
  deletePost: deletePost,
  toggleLike: toggleLike,
  getPostById: getPostById,
};

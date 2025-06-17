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
    // console.log(error);
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

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createPost: createPost,
  getAllPosts: getAllPosts,
  deletePost: deletePost,
};

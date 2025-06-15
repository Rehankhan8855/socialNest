import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PostBox } from "../components/web/PostBox";
import { CreatePost } from "../components/web/CreatePost";
import { useSelector } from "react-redux";
import { NavBar } from "../components/web/NavBar";

export default function FeedPage() {  
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/posts/get-all-posts"
      );
      console.log(response.data);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      // Use sample data if API fails
      // setPosts([
      //   { _id: '1', title: 'Sample Post by Rehan', description: 'Hello world!' },
      //   { _id: '2', title: 'Sample Post by John', description: 'Welcome to the feed!' }
      // ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userSelector) {
      navigate("/login");
    } else {
      fetchPosts();
    }
  }, [userSelector, navigate]);

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    // API returns the full post object - add it to the posts array
    setPosts([newPost.post, ...posts]);
  };

  // useEffect(() => {
  //   if (!userSelector) {
  //     navigate("/login");
  //   }
  // }, [userSelector, navigate]);
  return (
    <>
    <NavBar />
    <Box maxW="2xl" mx="auto" mt={10} p={0} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={0} align="stretch">
        <CreatePost onPostCreated={handlePostCreated} />
        
        {loading ? (
          <Center py={10}>
            <Spinner size="xl" />
          </Center>
        ) : error ? (
          <Center py={10}>
            <Text color="red.500">{error}</Text>
          </Center>
        ) : posts.length === 0 ? (
          <Center py={10}>
            <Text color="gray.500">No posts yet. Be the first to post!</Text>
          </Center>
        ) : (
          posts.map(post => post && (
            <PostBox 
              userId={post.userId}
              content={post.description} 
              createdAt={post.createdAt}
              key={post._id}
            />
          )).filter(Boolean)
        )}
      </VStack>
    </Box>
  </>
);
}
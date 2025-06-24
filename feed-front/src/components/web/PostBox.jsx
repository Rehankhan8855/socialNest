import { Avatar, Box, Button, Card, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const PostBox = ({ userId, content, createdAt, postId }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Just now";

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/user/get-user/${userId}`) // This is actually correct - the route is /api/user/get-user/:id
        .then((response) => {
          setUser(response.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setError("Failed to load user information");
          setLoading(false);
        });
    }
  }, [userId]);

  // const handleLikeToggle = () => {
  //   setLiked((prev) => !prev);
  // };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/posts/delete-post/${postId}`
      );
      alert("Post deleted!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const handleLikeToggle = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/posts/like/${postId}`, {
        userId: currentUser._id,
      });
      setLiked((prev) => !prev);
      setLikeCount(res.data.likes.length);
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/${postId}`
        );
        if (res.data.likes.includes(currentUser._id)) {
          setLiked(true);
        }
        setLikeCount(res.data.likes.length);
      } catch (err) {
        console.log("Error fetching post like status", err);
      }
    };
    if (postId && currentUser?._id) {
      fetchPost();
    }
  }, [postId, currentUser]);

  return (
    <Card.Root width="full" mb={2} borderBottomWidth="1px">
      <Card.Body gap="2">
        <Flex alignItems="center" gap={3}>
          <Avatar.Root
            size="md"
            onClick={() => navigate(`/profile/${user?._id}`)}
            cursor="pointer"
          >
            <Avatar.Fallback name={user?.name || "User"} />
            {user?.profilePicture && <Avatar.Image src={user.profilePicture} />}
          </Avatar.Root>
          <Box>
            <Text fontWeight="bold" cursor="pointer">
              {user?.name || "User"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {formattedDate}
            </Text>
          </Box>
        </Flex>
        <Card.Description mt={3} px={2}>
          {content}
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Text fontSize="sm" color="gray.600" px={2} fontStyle="italic" gap={2} mr={2}>
          {likeCount}{" "}
          {likeCount === 1 ? "person likes this" : "people like this"}
        </Text>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLikeToggle}
          color={liked ? "red.400" : "gray.500"}
          gap={2}
          >
          {liked ? "❤️ Liked" : "🤍 Like"}
        </Button>

        {currentUser?._id === userId && (
          <Button
            variant="ghost"
            size="sm"
            colorScheme="red"
            onClick={handleDelete}
            gap={2}
            _hover={{
              color: "red.600",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >
            🗑️ Delete
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
};

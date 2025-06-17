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

  const [liked, setLiked] = useState(false);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Just now";

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);
      axios
        .get(`http://localhost:5000/api/user/get-user/${userId}`)
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

  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/delete-post/${postId}`);
      alert("Post deleted!");
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  

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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLikeToggle}
          color={liked ? "red.400" : "gray.500"}
        >
          {liked ? "❤️ Liked" : "🤍 Like"}
        </Button>
        {/* <Button variant="ghost" size="sm">
          💬Comment
        </Button>
        <Button variant="ghost" size="sm">
          📤Share
        </Button> */}
        {currentUser?._id === userId && (
          <Button
            variant="ghost"
            size="sm"
            colorScheme="red"
            onClick={handleDelete}
          >
            🗑️ Delete
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
};

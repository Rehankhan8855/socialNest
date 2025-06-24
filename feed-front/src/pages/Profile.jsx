import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { Box, Input, Button, VStack, Text, HStack } from "@chakra-ui/react";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  transports: ["websocket"], // force websocket transport
});

const ProfileBox = () => {
  const params = useParams();
  const currentUserId = JSON.parse(localStorage.getItem("user"))._id;
  const receiverId = params.id;
  const [conversationId, setConversationId] = useState("");

  async function getConversationId() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages/get-conversation-id`,
        {
          currentUserId,
          receiverId,
        }
      );
      setConversationId(response.data.conversationId);
      return response.data.conversationId;
    } catch (error) {
      console.error("Error getting conversation ID:", error);
      return null;
    }
  }

  useEffect(() => {
    if (receiverId) {
      getConversationId();
    }
  }, [receiverId]);
  const { id } = useParams();
  console.log(id);
  // const receiverId = id;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit("add_user", currentUserId);

    return () => {
      socket.off("receive_message");
      socket.off("add_user");
    };
  }, [currentUserId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const data = {
      message,
      sender: currentUserId,
      receiver: receiverId,
      conversation: conversationId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages/send`,
        data
      );
      socket.emit("send_message", response.data.newMessage);
      console.log("Message sent response:", response.data);
      setChat((prev) => [...prev, response.data.newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }

  };



  const handleNewMessage = useCallback((newMessage) => {
    console.log("New message received:", newMessage);
    setChat((prevChat) => {
      const messageExists = prevChat.some(
        (msg) =>
          msg._id === newMessage._id ||
          (msg.sender._id === newMessage.sender._id &&
            msg.message === newMessage.message &&
            Math.abs(new Date(msg.createdAt) - new Date(newMessage.createdAt)) <
              1000)
      );
      if (messageExists) return prevChat;
      return [...prevChat, newMessage];
    });
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/get-all-messages/${conversationId}`
        );
        setChat(res.data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    fetchMessages();

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [conversationId, handleNewMessage]);

  return (
    <Box
    w="100%"
    maxW={['100%', '90%', '600px']}
    mx="auto"
    mt={6}
    p={4}
    bg={('white', 'gray.800')}
    boxShadow="xl"
    borderRadius="lg"
    borderWidth="1px"
  >
    <VStack spacing={4} align="stretch">
      <Box
        h="60vh"
        maxH="60vh"
        overflowY="auto"
        p={4}
        bg={('gray.50', 'gray.700')}
        borderRadius="md"
      >
        {chat.map((msg, index) => (
          <HStack
            key={index}
            justify={
              msg.sender._id === currentUserId ? 'flex-end' : 'flex-start'
            }
            mb={2}
          >
            <Box
              bg={
                msg.sender._id === currentUserId ? 'blue.400' : 'gray.100'
              }
              color={msg.sender._id === currentUserId ? 'white' : 'black'}
              px={4}
              py={2}
              borderRadius="xl"
              maxW="70%"
              boxShadow="md"
            >
              <Text fontSize="sm">
                <strong>
                  {msg.sender._id === currentUserId
                    ? 'You'
                    : msg.sender.name || 'Friend'}
                </strong>
                : {msg.message}
              </Text>
            </Box>
          </HStack>
        ))}
      </Box>

      <HStack>
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          borderRadius="full"
          bg={('white', 'blackAlpha.100')}
          _focus={{ bg: 'white' }}
        />
        <Button
          colorScheme="teal"
          borderRadius="full"
          px={6}
          onClick={sendMessage}
        >
          Send
        </Button>
      </HStack>
    </VStack>
  </Box>
  );
};

export default ProfileBox;

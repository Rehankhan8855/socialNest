import React, { useState } from "react";
import { Box, Button, Input, Heading, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../hooks/user";
import { useEffect } from "react";


export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { user, checkUser } = useUser();
  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user]);

  const handleSignup = async (e) => {
    e.preventDefault();
    // Simple validation (replace with real signup logic)

    if (!email || !password || !name) {
      setError("Please fill all fields.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/signup", {
        email,
        password,
        name,
        confirmPassword,
      });
      console.log(response);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setError("Failed to register user");
      setLoading(false);
    }
    setError("");
    // Simulate successful signup
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
      p={8}
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
    >
      <Heading mb={6}>Sign Up</Heading>
      <form onSubmit={handleSignup}>
        <VStack spacing={4}>
          <Input
            placeholder="Name"
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <Text color="red.500">{error}</Text>}
          <Button colorScheme="blue" type="submit" loading={loading}>
            Sign Up
          </Button>
        </VStack>
      </form>
      <Button mt={4} variant="link" onClick={() => navigate("/login")}>
        Already have an account? Log in
      </Button>
    </Box>
  );
}

"use client";

import { Box, Button, Field, Heading, Input, Link, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router-dom";


export const LoginBox = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    
    // optionally wait a tick before navigating
    setTimeout(() => {
      navigate("/feed");
    }, 100);
  }, []);
  
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, data);
      // Store both user data and token in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        setLoading(false);
        navigate('/feed', { replace: true });
      }, 300);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setErr(errorMessage);
      setLoading(false);
    }
  });
  console.log(err);



  
  return (
    <Box  maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
      <Heading alignSelf="center" fontWeight="bold" fontSize="2xl">Login</Heading>
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input {...register("email")} w={"350px"} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <Input {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        {err.error && (
          <Text color="red.500" alignSelf="center">
            {err.error}
          </Text>
        )}

        <Button type="submit" isLoading={loading} alignSelf="center">
          Login
        </Button>
        <Text alignSelf="center">
          Don't have an account?
          <NavLink to="/signup" end color="blue.500" fontWeight="bold">Sign up</NavLink>
        </Text>
      </Stack>
    </form>
    </Box>
  );
};

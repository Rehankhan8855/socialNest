import { Center } from "@chakra-ui/react";
import { LoginBox } from "../components/web/loginBox";
import { useUser } from "../hooks/user";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Login = () => {
  const { user, checkUser } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user]);

  return (
    <Center h="100vh" w="100vw">
      <LoginBox />
    </Center>
  );
};

"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  useDisclosure,
  Stack,
  Button,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";

const Links = ["Dashboard", "Projects", "Team"];

const NavLink = (props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const setUser = useSelector((state) =>state.user.setUser)
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("user");
    setShowDropdown(false);
  };

  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar.Root>
                    <Avatar.Fallback name={user?.user?.name} />
                    <Avatar.Image src={user?.user?.profilePicture} />
                  </Avatar.Root>
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      onClick={handleLogout}
                      variant="outline"
                      fontWeight="bold"
                      fontSize="md"
                      cursor="pointer"
                      zIndex={1000}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

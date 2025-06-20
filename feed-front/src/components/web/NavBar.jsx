"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  //   IconButton,
  //   Menu,
  //   MenuButton,
  //   MenuList,
  //   MenuItem,
  //   MenuDivider,
  useDisclosure,
  Stack,
  Button,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";
// import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

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
        // bg: useColorModeValue('gray.200', 'gray.700'),
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
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLogout = () => {
    navigate("/login");
    // setUser(null);
    localStorage.removeItem("user");
    setShowDropdown(false);
  };

  // console.log(user)
  return (
    <>
      <Box
        //    bg={useColorModeValue('gray.100', 'gray.900')}
        px={4}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {/* <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          /> */}
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
            {/* <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu> */}
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

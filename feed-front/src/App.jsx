import { useEffect, useState } from "react";
import { Button, Center, Theme } from "@chakra-ui/react";
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ColorModeProvider } from "./components/ui/color-mode";
import {Login} from "./pages/Login";
import {Signup} from "./pages/Signup";
import FeedPage from "./pages/FeedPage";
import { useDispatch, useSelector } from "react-redux";
import store from "./store";
import { setUser } from "./store/userSlice";
import ProfileBox from "./pages/Profile";
import { Provider } from "./components/ui/provider";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
});

// const system = createSystem(defaultConfig, config)

function App() {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user.user);
  useEffect(() => {
    dispatch(setUser(localStorage.getItem("user")));
  }, []);

  return (
    <Provider store={store}>
      <Theme appearance="light">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeNav />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile/:id" element={<ProfileBox />} />
          </Routes>
        </BrowserRouter>
      </Theme>
    </Provider>
  );
}

function HomeNav() {
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.user.user);

  useEffect(() => {
    if (userSelector !== null) {
      navigate("/feed");
    }
  }, [userSelector]);
  return (
    <Center h="100vh" w="100vw">
      <Button variant={"ghost"} mr={4} onClick={() => navigate("/login")}>
        Login
      </Button>
      <Button variant={"solid"} onClick={() => navigate("/signup")}>
        Signup
      </Button>
    </Center>
  );
}

export default App;

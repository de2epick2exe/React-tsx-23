import { RouteProps } from "react-router-dom";
import App from "./App";
import Eng_Ua from "./components/Eng_Ua";
import NotFound from "./components/NotFound";
import Streams from "./components/Streams";
import Auth from "./components/Auth";
import Messeger from "./components/Messeger";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Register from "./components/Register";

const routes: RouteProps[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game",
    element: <Eng_Ua />,
  },
  {
    path: "/streams",
    element: <Streams />,
  },
  {
    path: "/authorize",
    element: <Auth />,
  },
  {
    path: "/messager",
    element: <Messeger />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  { path: "/admin", element: <Admin /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  ///

  // Add more routes as needed
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

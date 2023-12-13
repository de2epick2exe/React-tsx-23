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
import Settings from "./components/Settings";
import Contacts from "./components/Contacts";

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
    path: "/profile/:id",
    element: <Profile />,
  },
  { path: "/admin", element: <Admin /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {path: '/settings', element:<Settings/>},
  {path: '/contacts', element:<Contacts/>},

  ///

  // Add more routes as needed
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

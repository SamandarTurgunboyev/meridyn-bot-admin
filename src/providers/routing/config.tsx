import Login from "@/pages/Login";
import { Outlet, type RouteObject } from "react-router-dom";

const routesConfig: RouteObject = {
  element: <Outlet />,
  children: [
    {
      children: [
        {
          path: "/",
          element: <Login />,
        },
      ],
    },
  ],
};
export default routesConfig;

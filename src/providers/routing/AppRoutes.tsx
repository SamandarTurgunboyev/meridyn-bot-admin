import LoginLayout from "@/LoginLayout";
import Districts from "@/pages/Districts";
import Doctors from "@/pages/Doctors";
import UsersPage from "@/pages/Home";
import Objects from "@/pages/Objects";
import Pharm from "@/pages/Pharm";
import Pharmacies from "@/pages/Pharmacies";
import Pill from "@/pages/Pill";
import Plans from "@/pages/Plans";
import Region from "@/pages/Region";
import Reports from "@/pages/Reports";
import SentLocations from "@/pages/SentLocations";
import Specifications from "@/pages/Specifications";
import TourPlan from "@/pages/TourPlan";
import routesConfig from "@/providers/routing/config";
import { Navigate, useRoutes } from "react-router-dom";

const AppRouter = () => {
  const routes = useRoutes([
    routesConfig,
    {
      path: "*",
      element: <Navigate to="/" />,
    },
    {
      path: "/dashboard",
      element: (
        <LoginLayout>
          <UsersPage />
        </LoginLayout>
      ),
    },
    {
      path: "/dashboard/plans",
      element: <Plans />,
    },
    {
      path: "/dashboard/districts",
      element: <Districts />,
    },
    {
      path: "/dashboard/objects",
      element: <Objects />,
    },
    {
      path: "/dashboard/doctors",
      element: <Doctors />,
    },
    {
      path: "/dashboard/pharmacies",
      element: <Pharmacies />,
    },
    {
      path: "/dashboard/reports",
      element: <Reports />,
    },
    {
      path: "/dashboard/sent-locations",
      element: <SentLocations />,
    },
    {
      path: "/dashboard/specifications",
      element: <Specifications />,
    },
    {
      path: "/dashboard/pill",
      element: <Pill />,
    },
    {
      path: "/dashboard/pharm",
      element: <Pharm />,
    },
    {
      path: "/dashboard/tour-plan",
      element: <TourPlan />,
    },
    {
      path: "/dashboard/region",
      element: <Region />,
    },
  ]);

  return routes;
};

export default AppRouter;

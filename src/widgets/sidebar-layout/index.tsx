import {
  AlertCircle,
  BriefcaseMedical,
  Building2,
  Calendar,
  ClipboardList,
  FileText,
  Hospital,
  ListChecks,
  LogOut,
  Map,
  MapPin,
  MapPinned,
  Microscope,
  Pill,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { removeToken } from "@/shared/lib/cookie";
import { Button } from "@/shared/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

const items = [
  {
    title: "Foydalanuvchilar",
    url: "/dashboard",
    icon: Users,
  },
  {
    title: "Rejalar",
    url: "/dashboard/plans",
    icon: Calendar,
  },
  {
    title: "Tumanlar",
    url: "/dashboard/districts",
    icon: Building2,
  },
  {
    title: "Obyektlar",
    url: "/dashboard/objects",
    icon: MapPinned,
  },
  {
    title: "Shifokorlar",
    url: "/dashboard/doctors",
    icon: BriefcaseMedical,
  },
  {
    title: "Dorixonalar",
    url: "/dashboard/pharmacies",
    icon: Hospital,
  },
  {
    title: "Jo'natilgan joylar",
    url: "/dashboard/sent-locations",
    icon: MapPin,
  },
  {
    title: "Spesifikatsiyalar",
    url: "/dashboard/specifications",
    icon: FileText,
  },
  {
    title: "Hisobotlar",
    url: "/dashboard/reports",
    icon: ClipboardList,
  },
  {
    title: "Tur planlar",
    url: "/dashboard/tour-plan",
    icon: ListChecks,
  },
  {
    title: "Hududlar",
    url: "/dashboard/region",
    icon: Map,
  },
  {
    title: "Dorilar ro'yxati",
    url: "/dashboard/pill",
    icon: Pill,
  },
  {
    title: "Farmasevtikalar",
    url: "/dashboard/pharmaceuticals",
    icon: Microscope,
  },
  {
    title: "Yordam so'rovlari",
    url: "/dashboard/support",
    icon: AlertCircle,
  },
  {
    title: "Tarqatilgan dorilar",
    url: "/dashboard/distributed-product",
    icon: Pill,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="w-64 bg-white border-r border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-center h-16 border-b border-gray-200">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                        isActive(item.url)
                          ? "bg-blue-500 text-white hover:!bg-blue-500 hover:text-white"
                          : "text-gray-800 hover:!bg-blue-100"
                      }`}
                    >
                      <item.icon
                        className={`!w-5 !h-5 ${
                          isActive(item.url) ? "text-white" : "text-gray-600"
                        }`}
                      />
                      <span className="font-medium text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant={"ghost"}
          className="w-fit text-red-500 hover:text-red-500 cursor-pointer"
          onClick={() => {
            navigate("/");
            removeToken();
          }}
        >
          <LogOut />
          <p>Chiqish</p>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

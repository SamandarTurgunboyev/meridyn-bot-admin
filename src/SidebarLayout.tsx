import { user_api } from "@/shared/config/api/user/api";
import { userStore } from "@/shared/hooks/user";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/widgets/sidebar-layout";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const { data } = useQuery({
    queryKey: ["get_me"],
    queryFn: () => user_api.getMe(),
    select(data) {
      return data.data.data;
    },
  });
  const { addUser } = userStore();

  useEffect(() => {
    if (data) {
      addUser(data);
    }
  }, [data]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;

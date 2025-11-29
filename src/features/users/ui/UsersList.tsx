import SidebarLayout from "@/SidebarLayout";
import type { RegionListResData } from "@/features/region/lib/data";
import { user_api } from "@/features/users/lib/api";
import type { UserListData } from "@/features/users/lib/data";
import DeleteUser from "@/features/users/ui/DeleteUser";
import Filter from "@/features/users/ui/Filter";
import UserTable from "@/features/users/ui/UserTable";
import Pagination from "@/shared/ui/pagination";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const UsersList = () => {
  const [editingUser, setEditingUser] = useState<UserListData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionValue, setRegionValue] = useState<RegionListResData | null>(
    null,
  );
  const limit = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">(
    "all",
  );

  const [userDelete, setUserDelete] = useState<UserListData | null>(null);
  const [opneDelete, setOpenDelete] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user_list", currentPage, statusFilter, regionValue, searchTerm],
    queryFn: () => {
      const params: {
        limit?: number;
        offset?: number;
        search?: string;
        is_active?: boolean | string;
        region_id?: number;
      } = {
        limit,
        offset: (currentPage - 1) * limit,
        search: searchTerm,
      };

      if (regionValue !== null) {
        params.region_id = Number(regionValue.id);
      }

      if (statusFilter !== "all") {
        params.is_active = statusFilter;
      }

      return user_api.list(params);
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (user: UserListData) => {
    setUserDelete(user);
    setOpenDelete(true);
  };

  const totalPages = data ? Math.ceil(data.data.data.count / limit) : 1;

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full p-10 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">Foydalanuvchilar ro'yxati</h1>

          <Filter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
            regionValue={regionValue}
            setRegionValue={setRegionValue}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
          />
        </div>

        <UserTable
          data={data}
          isLoading={isLoading}
          setEditingUser={setEditingUser}
          isError={isError}
          setDialogOpen={setDialogOpen}
          handleDelete={handleDelete}
          currentPage={currentPage}
        />
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />

        <DeleteUser
          opneDelete={opneDelete}
          setOpenDelete={setOpenDelete}
          userDelete={userDelete}
          setUserDelete={setUserDelete}
        />
      </div>
    </SidebarLayout>
  );
};

export default UsersList;

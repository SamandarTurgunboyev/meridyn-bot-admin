import { plans_api } from "@/features/plans/lib/api";
import type { PlanListData } from "@/features/plans/lib/data";
import DeletePlan from "@/features/plans/ui/DeletePlan";
import FilterPlans from "@/features/plans/ui/FilterPlans";
import PalanTable from "@/features/plans/ui/PalanTable";
import PlanDetail from "@/features/plans/ui/PlanDetail";
import formatDate from "@/shared/lib/formatDate";
import Pagination from "@/shared/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const PlansList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<string>("");
  const limit = 20;
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["plan_list", dateFilter, searchUser, statusFilter, currentPage],
    queryFn: () => {
      const params: {
        limit?: number;
        offset?: number;
        status?: boolean;
        date?: string;
        user?: string;
      } = {
        date: dateFilter && formatDate.format(dateFilter, "YYYY-MM-DD"),
        user: searchUser,
        limit,
        offset: (currentPage - 1) * limit,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter === "true" ? true : false;
      }

      return plans_api.list(params);
    },
    select(data) {
      return data.data.data;
    },
  });

  const totalPages = data ? Math.ceil(data.count / limit) : 1;
  const [editingPlan, setEditingPlan] = useState<PlanListData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detail, setDetail] = useState<boolean>(false);

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [planDelete, setPlanDelete] = useState<PlanListData | null>(null);

  const handleDelete = (id: PlanListData) => {
    setOpenDelete(true);
    setPlanDelete(id);
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Rejalarni boshqarish</h1>
        <FilterPlans
          dateFilter={dateFilter}
          dialogOpen={dialogOpen}
          editingPlan={editingPlan}
          open={open}
          searchUser={searchUser}
          setDateFilter={setDateFilter}
          setDialogOpen={setDialogOpen}
          setEditingPlan={setEditingPlan}
          setOpen={setOpen}
          setSearchUser={setSearchUser}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
        />

        <PlanDetail detail={detail} setDetail={setDetail} plan={editingPlan} />
      </div>

      <PalanTable
        filteredPlans={data ? data.results : []}
        handleDelete={handleDelete}
        setDetail={setDetail}
        setDialogOpen={setDialogOpen}
        setEditingPlan={setEditingPlan}
        isError={isError}
        isFetching={isFetching}
        isLoading={isLoading}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DeletePlan
        opneDelete={openDelete}
        planDelete={planDelete}
        setOpenDelete={setOpenDelete}
        setPlanDelete={setPlanDelete}
      />
    </div>
  );
};

export default PlansList;

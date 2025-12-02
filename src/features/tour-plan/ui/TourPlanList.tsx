import { tour_plan_api } from "@/features/tour-plan/lib/api";
import { type PlanTourListDataRes } from "@/features/tour-plan/lib/data";
import DeleteTourPlan from "@/features/tour-plan/ui/DeleteTourPlab";
import FilterTourPlan from "@/features/tour-plan/ui/FilterTourPlan";
import TourPlanDetailDialog from "@/features/tour-plan/ui/TourPlanDetailDialog";
import TourPlanTable from "@/features/tour-plan/ui/TourPlanTable";
import formatDate from "@/shared/lib/formatDate";
import Pagination from "@/shared/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TourPlanList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [searchUser, setSearchUser] = useState<string>("");

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ["tour_plan_list", currentPage, dateFilter, searchUser],
    queryFn: () =>
      tour_plan_api.list({
        limit,
        offset: (currentPage - 1) * limit,
        date: dateFilter && formatDate.format(dateFilter, "YYYY-MM-DD"),
        user: searchUser,
      }),
    select(data) {
      return data.data.data;
    },
  });

  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  const [editingPlan, setEditingPlan] = useState<PlanTourListDataRes | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detail, setDetail] = useState<PlanTourListDataRes | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [planDelete, setPlanDelete] = useState<PlanTourListDataRes | null>(
    null,
  );

  const handleDelete = (id: PlanTourListDataRes) => {
    setOpenDelete(true);
    setPlanDelete(id);
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Rejalarni boshqarish</h1>

        <FilterTourPlan
          dateFilter={dateFilter}
          dialogOpen={dialogOpen}
          editingPlan={editingPlan}
          searchUser={searchUser}
          setDateFilter={setDateFilter}
          setDialogOpen={setDialogOpen}
          setEditingPlan={setEditingPlan}
          setSearchUser={setSearchUser}
        />

        <TourPlanDetailDialog
          plan={detail}
          setOpen={setDetailOpen}
          open={detailOpen}
        />
      </div>

      <TourPlanTable
        data={data ? data.results : []}
        handleDelete={handleDelete}
        isError={isError}
        isFetching={isFetching}
        isLoading={isLoading}
        setDetail={setDetail}
        setDetailOpen={setDetailOpen}
        setDialogOpen={setDialogOpen}
        setEditingPlan={setEditingPlan}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DeleteTourPlan
        opneDelete={openDelete}
        planDelete={planDelete}
        setOpenDelete={setOpenDelete}
        setPlanDelete={setPlanDelete}
      />
    </div>
  );
};

export default TourPlanList;

import type { Plan } from "@/features/plans/lib/data";
import FilterPlans from "@/features/plans/ui/FilterPlans";
import PalanTable from "@/features/plans/ui/PalanTable";
import PlanDetail from "@/features/plans/ui/PlanDetail";
import { FakeUserList } from "@/features/users/lib/data";
import Pagination from "@/shared/ui/pagination";
import { useMemo, useState } from "react";

const PlansList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 1,
      name: "Tumanga borish",
      description: "Tumanga borish rejasi",
      user: FakeUserList[0],
      status: "Bajarildi",
      createdAt: new Date("2025-02-03"),
    },
    {
      id: 2,
      name: "Yangi reja",
      description: "Yangi reja tavsifi",
      user: FakeUserList[1],
      status: "Bajarilmagan",
      createdAt: new Date("2025-01-12"),
    },
  ]);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detail, setDetail] = useState<boolean>(false);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<string>("");

  const handleDelete = (id: number) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((item) => {
      const statusMatch =
        statusFilter === "all" || item.status === statusFilter;

      const dateMatch = dateFilter
        ? item.createdAt.toDateString() === dateFilter.toDateString()
        : true;

      const userMatch = `${item.user.firstName} ${item.user.lastName}`
        .toLowerCase()
        .includes(searchUser.toLowerCase());

      return statusMatch && dateMatch && userMatch;
    });
  }, [plans, statusFilter, dateFilter, searchUser]);

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
          setPlans={setPlans}
          setSearchUser={setSearchUser}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
        />

        <PlanDetail detail={detail} setDetail={setDetail} plan={editingPlan} />
      </div>

      <PalanTable
        filteredPlans={filteredPlans}
        handleDelete={handleDelete}
        setDetail={setDetail}
        setDialogOpen={setDialogOpen}
        setEditingPlan={setEditingPlan}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default PlansList;

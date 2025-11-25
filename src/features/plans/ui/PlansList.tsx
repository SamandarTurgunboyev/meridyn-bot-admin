"use client";

import type { Plan } from "@/features/plans/lib/data";
import AddedPlan from "@/features/plans/ui/AddedPlan";
import PlanDetail from "@/features/plans/ui/PlanDetail";
import { FakeUserList } from "@/features/users/lib/data";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import clsx from "clsx";
import {
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Plus,
  Trash,
} from "lucide-react";
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
      // 1) Status (agar all bo'lsa filtrlanmaydi)
      const statusMatch =
        statusFilter === "all" || item.status === statusFilter;

      // 2) Sana filtri: createdAt === tanlangan sana
      const dateMatch = dateFilter
        ? item.createdAt.toDateString() === dateFilter.toDateString()
        : true;

      // 3) User ism familiya bo'yicha qidiruv
      const userMatch = `${item.user.firstName} ${item.user.lastName}`
        .toLowerCase()
        .includes(searchUser.toLowerCase());

      return statusMatch && dateMatch && userMatch;
    });
  }, [plans, statusFilter, dateFilter, searchUser]);

  return (
    <div className="flex flex-col h-full p-10 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Rejalarni boshqarish</h1>

        <div className="flex gap-2 mb-4">
          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full !h-12">
              <SelectValue placeholder="foydalanuvchi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="Bajarildi">Bajarildi</SelectItem>
              <SelectItem value="Bajarilmagan">Bajarilmagan</SelectItem>
            </SelectContent>
          </Select>

          {/* Sana filter */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal h-12"
              >
                {dateFilter ? dateFilter.toDateString() : "Sana"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateFilter}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDateFilter(date);
                  setOpen(false);
                }}
              />
              <div className="p-2 border-t bg-white">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setDateFilter(undefined);
                    setOpen(false);
                  }}
                >
                  Tozalash
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Input
            type="text"
            placeholder="Foydalanuvchi ismi"
            className="h-12"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-blue-500 cursor-pointer hover:bg-blue-500 h-12"
                onClick={() => setEditingPlan(null)}
              >
                <Plus className="!h-5 !w-5" /> Qo'shish
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingPlan ? "Rejani tahrirlash" : "Yangi reja qo'shish"}
                </DialogTitle>
              </DialogHeader>

              {/* Form */}
              <AddedPlan
                initialValues={editingPlan}
                setDialogOpen={setDialogOpen}
                setPlans={setPlans}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Deail plan */}
        <PlanDetail detail={detail} setDetail={setDetail} plan={editingPlan} />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-start">ID</TableHead>
              <TableHead className="text-start">Reja nomi</TableHead>
              <TableHead className="text-start">Tavsifi</TableHead>
              <TableHead className="text-start">Kimga tegishli</TableHead>
              <TableHead className="text-start">Status</TableHead>
              <TableHead className="text-right">Harakatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id} className="text-start">
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>
                  {plan.user.firstName + " " + plan.user.lastName}
                </TableCell>
                <TableCell
                  className={clsx(
                    plan.status === "Bajarildi"
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {plan.status}
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 text-white cursor-pointer hover:bg-green-500 hover:text-white"
                    onClick={() => {
                      setEditingPlan(plan);
                      setDetail(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 text-white hover:bg-blue-500 hover:text-white cursor-pointer"
                    onClick={() => {
                      setEditingPlan(plan);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-2 sticky bottom-0 bg-white flex justify-end gap-2 z-10 py-2 border-t">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          className="cursor-pointer"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <ChevronLeft />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            size="icon"
            className={clsx(
              currentPage === i + 1
                ? "bg-blue-500 hover:bg-blue-500"
                : " bg-none hover:bg-blue-200",
              "cursor-pointer",
            )}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="cursor-pointer"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default PlansList;

import { fakeTourPlan, type TourPlanType } from "@/features/tour-plan/lib/data";
import AddedTourPlan from "@/features/tour-plan/ui/AddedTourPlan";
import TourPlanDetailDialog from "@/features/tour-plan/ui/TourPlanDetailDialog";
import formatDate from "@/shared/lib/formatDate";
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

const TourPlanList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [plans, setPlans] = useState<TourPlanType[]>(fakeTourPlan);

  const [editingPlan, setEditingPlan] = useState<TourPlanType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detail, setDetail] = useState<TourPlanType | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);

  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<string>("");

  const handleDelete = (id: number) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((item) => {
      // 2) Sana filtri: createdAt === tanlangan sana
      const dateMatch = dateFilter
        ? item.date.toDateString() === dateFilter.toDateString()
        : true;

      // 3) User ism familiya bo'yicha qidiruv
      const userMatch = `${item.user.firstName} ${item.user.lastName}`
        .toLowerCase()
        .includes(searchUser.toLowerCase());

      return dateMatch && userMatch;
    });
  }, [plans, dateFilter, searchUser]);

  return (
    <div className="flex flex-col h-full p-10 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Rejalarni boshqarish</h1>

        <div className="flex gap-2 mb-4">
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

              <AddedTourPlan
                initialValues={editingPlan}
                setDialogOpen={setDialogOpen}
                setPlans={setPlans}
              />
            </DialogContent>
          </Dialog>
        </div>

        <TourPlanDetailDialog
          plan={detail}
          setOpen={setDetailOpen}
          open={detailOpen}
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-start">ID</TableHead>
              <TableHead className="text-start">Kimga tegishli</TableHead>
              <TableHead className="text-start">Boriladigan joyi</TableHead>
              <TableHead className="text-start">Sanasi</TableHead>
              <TableHead className="text-start">Statusi</TableHead>
              <TableHead className="text-right">Harakatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id} className="text-start">
                <TableCell>{plan.id}</TableCell>
                <TableCell>
                  {plan.user.firstName + " " + plan.user.lastName}
                </TableCell>
                <TableCell>{plan.district}</TableCell>
                <TableCell>
                  {formatDate.format(plan.date, "DD-MM-YYYY")}
                </TableCell>
                <TableCell
                  className={clsx(
                    plan.status === "completed"
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {plan.status === "completed" ? "Borildi" : "Borilmagan"}
                </TableCell>

                <TableCell className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setDetail(plan);
                      setDetailOpen(true);
                    }}
                    className="bg-green-600 text-white cursor-pointer hover:bg-green-600 hover:text-white"
                  >
                    <Eye size={18} />
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

export default TourPlanList;

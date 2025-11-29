import type { Plan } from "@/features/plans/lib/data";
import AddedPlan from "@/features/plans/ui/AddedPlan";
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
import { ChevronDownIcon, Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  dateFilter: Date | undefined;
  setDateFilter: Dispatch<SetStateAction<Date | undefined>>;
  searchUser: string;
  setSearchUser: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingPlan: Plan | null;
  setEditingPlan: Dispatch<SetStateAction<Plan | null>>;
  setPlans: Dispatch<SetStateAction<Plan[]>>;
}

const FilterPlans = ({
  setStatusFilter,
  statusFilter,
  open,
  setOpen,
  dateFilter,
  setDateFilter,
  searchUser,
  setSearchUser,
  dialogOpen,
  setDialogOpen,
  setEditingPlan,
  editingPlan,
  setPlans,
}: Props) => {
  return (
    <div className="flex gap-2 mb-4">
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
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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

          <AddedPlan
            initialValues={editingPlan}
            setDialogOpen={setDialogOpen}
            setPlans={setPlans}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilterPlans;

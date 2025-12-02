import type { PlanTourListDataRes } from "@/features/tour-plan/lib/data";
import AddedTourPlan from "@/features/tour-plan/ui/AddedTourPlan";
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
import { ChevronDownIcon, Plus } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

interface Props {
  dateFilter: Date | undefined;
  setDateFilter: Dispatch<SetStateAction<Date | undefined>>;
  searchUser: string;
  setSearchUser: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setEditingPlan: Dispatch<SetStateAction<PlanTourListDataRes | null>>;
  editingPlan: PlanTourListDataRes | null;
}

const FilterTourPlan = ({
  dateFilter,
  setDateFilter,
  searchUser,
  setSearchUser,
  setDialogOpen,
  dialogOpen,
  setEditingPlan,
  editingPlan,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex gap-2 mb-4">
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
            toYear={new Date().getFullYear() + 50}
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilterTourPlan;

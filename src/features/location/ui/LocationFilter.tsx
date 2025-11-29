import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  dateFilter: Date | undefined;
  setDateFilter: Dispatch<SetStateAction<Date | undefined>>;
  searchUser: string;
  setSearchUser: Dispatch<SetStateAction<string>>;
}

const LocationFilter = ({
  open,
  setOpen,
  dateFilter,
  setDateFilter,
  searchUser,
  setSearchUser,
}: Props) => {
  return (
    <div className="flex gap-2 w-full md:w-auto">
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
    </div>
  );
};

export default LocationFilter;

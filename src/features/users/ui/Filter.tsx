import { region_api } from "@/features/region/lib/api";
import type { RegionListResData } from "@/features/region/lib/data";
import type { UserListData } from "@/features/users/lib/data";
import AddUsers from "@/features/users/ui/AddUsers";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
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
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  statusFilter: "all" | "true" | "false";
  setStatusFilter: Dispatch<SetStateAction<"all" | "true" | "false">>;
  regionValue: RegionListResData | null;
  setRegionValue: Dispatch<SetStateAction<RegionListResData | null>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingUser: UserListData | null;
  setEditingUser: Dispatch<SetStateAction<UserListData | null>>;
}

const Filter = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  regionValue,
  setRegionValue,
  dialogOpen,
  setDialogOpen,
  editingUser,
  setEditingUser,
}: Props) => {
  const [openRegion, setOpenRegion] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");

  const { data: regions, isLoading } = useQuery({
    queryKey: ["region_list", regionSearch],
    queryFn: () => region_api.list({ name: regionSearch }),
    select: (res) => res.data.data,
  });

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Search input */}
      <Input
        type="text"
        placeholder="Ism yoki Familiyasi bo'yicha qidirish"
        className="border rounded px-3 py-2 text-sm w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select
        value={statusFilter}
        onValueChange={(val) =>
          setStatusFilter(val as "all" | "true" | "false")
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Holati" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Barchasi</SelectItem>
          <SelectItem value="true">Faol</SelectItem>
          <SelectItem value="false">Faol emas</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={openRegion} onOpenChange={setOpenRegion}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={openRegion}
            className={cn(
              "w-64 h-12 justify-between",
              !regionValue && "text-muted-foreground",
            )}
          >
            {regionValue ? regionValue.name : "Hudud tanlang"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Hududni qidirish..."
              className="h-9"
              value={regionSearch}
              onValueChange={setRegionSearch}
            />
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                </div>
              ) : regions && regions.length > 0 ? (
                <CommandGroup>
                  <CommandItem
                    value={""}
                    onSelect={() => {
                      setRegionValue(null);
                      setRegionSearch("");
                      setOpenRegion(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        regionValue === null ? "opacity-100" : "opacity-0",
                      )}
                    />
                    Barchasi
                  </CommandItem>
                  {regions.map((r) => (
                    <CommandItem
                      key={r.id}
                      value={`${r.name}`}
                      onSelect={() => {
                        setRegionValue(r);
                        setRegionSearch("");
                        setOpenRegion(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          regionValue?.id === r.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {r.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>Hudud topilmadi</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="bg-blue-500 cursor-pointer hover:bg-blue-500"
            onClick={() => setEditingUser(null)}
          >
            <Plus className="!h-5 !w-5" /> Qo'shish
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingUser
                ? "Foydalanuvchini tahrirlash"
                : "Foydalanuvchi qo'shish"}
            </DialogTitle>
          </DialogHeader>

          <AddUsers initialData={editingUser} setDialogOpen={setDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Filter;

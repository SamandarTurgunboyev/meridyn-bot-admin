import type { DistrictListData } from "@/features/districts/lib/data";
import AddDistrict from "@/features/districts/ui/AddDistrict";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Plus } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editing: DistrictListData | null;
  setEditing: Dispatch<SetStateAction<DistrictListData | null>>;
}

const Filter = ({
  search,
  setSearch,
  dialogOpen,
  setDialogOpen,
  setEditing,
  editing,
}: Props) => {
  return (
    <div className="flex gap-4 justify-end">
      <Input
        placeholder="Tuman nomi bo‘yicha qidirish..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm h-12"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setEditing(null)}
            className="bg-blue-500 h-12 cursor-pointer hover:bg-blue-500"
          >
            <Plus className="w-5 h-5 mr-1" /> Tuman qo‘shish
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editing ? "Tumanni tahrirlash" : "Yangi tuman qo‘shish"}
            </DialogTitle>
          </DialogHeader>

          <AddDistrict initialValues={editing} setDialogOpen={setDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Filter;

import type { ObjectListData } from "@/features/objects/lib/data";
import AddedObject from "@/features/objects/ui/AddedObject";
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
import type { Dispatch, SetStateAction } from "react";

interface Props {
  searchName: string;
  setSearchName: Dispatch<SetStateAction<string>>;
  searchDistrict: string;
  setSearchDistrict: Dispatch<SetStateAction<string>>;
  searchUser: string;
  setSearchUser: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setEditingPlan: Dispatch<SetStateAction<ObjectListData | null>>;
  editingPlan: ObjectListData | null;
}

const ObjectFilter = ({
  searchName,
  setSearchName,
  searchDistrict,
  setSearchDistrict,
  searchUser,
  setSearchUser,
  dialogOpen,
  setDialogOpen,
  editingPlan,
  setEditingPlan,
}: Props) => {
  return (
    <div className="flex gap-2 flex-wrap w-full md:w-auto">
      <Input
        placeholder="Obyekt nomi"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="w-full md:w-48"
      />
      <Input
        placeholder="Tuman"
        value={searchDistrict}
        onChange={(e) => setSearchDistrict(e.target.value)}
        className="w-full md:w-48"
      />
      <Input
        placeholder="Foydalanuvchi"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
        className="w-full md:w-48"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="bg-blue-500 cursor-pointer hover:bg-blue-500"
            onClick={() => setEditingPlan(null)}
          >
            <Plus className="!h-5 !w-5" /> Qo'shish
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingPlan ? "Obyektni tahrirlash" : "Yangi obyekt qo'shish"}
            </DialogTitle>
          </DialogHeader>

          <AddedObject
            initialValues={editingPlan}
            setDialogOpen={setDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObjectFilter;

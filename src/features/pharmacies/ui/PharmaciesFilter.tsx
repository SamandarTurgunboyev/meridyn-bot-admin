import type { PharmaciesListData } from "@/features/pharmacies/lib/data";
import AddedPharmacies from "@/features/pharmacies/ui/AddedPharmacies";
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
  searchObject: string;
  setSearchObject: Dispatch<SetStateAction<string>>;
  searchUser: string;
  setSearchUser: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setEditingPlan: Dispatch<SetStateAction<PharmaciesListData | null>>;
  editingPlan: PharmaciesListData | null;
}

const PharmaciesFilter = ({
  searchName,
  setSearchName,
  searchDistrict,
  setSearchDistrict,
  searchObject,
  searchUser,
  setSearchUser,
  setSearchObject,
  dialogOpen,
  setDialogOpen,
  setEditingPlan,
  editingPlan,
}: Props) => {
  return (
    <div className="flex justify-end gap-2 w-full">
      <Input
        placeholder="Dorixona nomi"
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
        placeholder="Obyekt"
        value={searchObject}
        onChange={(e) => setSearchObject(e.target.value)}
        className="w-full md:w-48"
      />
      <Input
        placeholder="Kim qo'shgan"
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
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingPlan
                ? "Dorixonani tahrirlash"
                : "Yangi dorixona qo'shish"}
            </DialogTitle>
          </DialogHeader>
          <AddedPharmacies
            initialValues={editingPlan}
            setDialogOpen={setDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PharmaciesFilter;

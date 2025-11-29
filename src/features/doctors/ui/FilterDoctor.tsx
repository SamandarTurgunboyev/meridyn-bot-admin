import type { DoctorListType } from "@/features/doctors/lib/data";
import AddedDoctor from "@/features/doctors/ui/AddedDoctor";
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
  searchWork: string;
  setSearchWork: Dispatch<SetStateAction<string>>;
  searchSpec: string;
  setSearchSpec: Dispatch<SetStateAction<string>>;
  searchUser: string;
  setSearchUser: Dispatch<SetStateAction<string>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  searchObject: string;
  setSearchObject: Dispatch<SetStateAction<string>>;
  setEditingPlan: Dispatch<SetStateAction<DoctorListType | null>>;
  editingPlan: DoctorListType | null;
}

const FilterDoctor = ({
  searchName,
  setSearchName,
  searchDistrict,
  setSearchDistrict,
  searchObject,
  setSearchObject,
  searchWork,
  setSearchWork,
  searchSpec,
  setSearchSpec,
  searchUser,
  setSearchUser,
  dialogOpen,
  setDialogOpen,
  setEditingPlan,
  editingPlan,
}: Props) => {
  return (
    <div className="flex justify-end gap-2 w-full">
      <Input
        placeholder="Shifokor Ism Familiyasi"
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
        placeholder="Ish joyi"
        value={searchWork}
        onChange={(e) => setSearchWork(e.target.value)}
        className="w-full md:w-48"
      />
      <Input
        placeholder="Sohasi"
        value={searchSpec}
        onChange={(e) => setSearchSpec(e.target.value)}
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
              {editingPlan ? "Shifokor tahrirlash" : "Yangi shifokor qo'shish"}
            </DialogTitle>
          </DialogHeader>
          <AddedDoctor
            initialValues={editingPlan}
            setDialogOpen={setDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilterDoctor;

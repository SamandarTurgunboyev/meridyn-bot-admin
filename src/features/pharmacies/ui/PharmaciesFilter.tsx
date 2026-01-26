import { pharmacies_api } from "@/features/pharmacies/lib/api";
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
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { CloudDownload, Loader2, Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

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
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await pharmacies_api.export();
      return res.data;
    },
    onSuccess: (data: Blob) => {
      // Blob URL yaratish
      const url = window.URL.createObjectURL(
        new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );

      // <a> elementi orqali yuklab olish
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dorixonalar.xlsx"); // Fayl nomi
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Blob URL-ni ozod qilish
      window.URL.revokeObjectURL(url);

      toast.success("Excel muvaffaqiyatli yuklab olindi", {
        position: "top-center",
        richColors: true,
      });
    },
    onError: (err: AxiosError) => {
      const errMessage = err.response?.data as { message: string };
      const messageText = errMessage.message;

      toast.error(messageText || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });
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
      <Button
        variant="default"
        className="bg-blue-500 cursor-pointer hover:bg-blue-500"
        onClick={() => mutate()}
        disabled={isPending}
      >
        <CloudDownload className="!h-5 !w-5" /> Excel formatda yuklash
        {isPending && <Loader2 className="animate-spin" />}
      </Button>
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

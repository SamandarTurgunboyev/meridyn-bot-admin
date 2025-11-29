import { region_api } from "@/features/region/lib/api";
import { type RegionListResData } from "@/features/region/lib/data";
import AddedRegion from "@/features/region/ui/AddedRegion";
import DeleteRegion from "@/features/region/ui/DeleteRegion";
import RegionTable from "@/features/region/ui/RegionTable";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useQuery } from "@tanstack/react-query";

import { Plus } from "lucide-react";
import { useState } from "react";

const RegionList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["region_list"],
    queryFn: () => region_api.list({}),
    select(data) {
      return data.data.data;
    },
  });

  const [regionDelete, setRegionDelete] = useState<RegionListResData | null>(
    null,
  );
  const [opneDelete, setOpenDelete] = useState<boolean>(false);

  const [editingPlan, setEditingPlan] = useState<RegionListResData | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (user: RegionListResData) => {
    setRegionDelete(user);
    setOpenDelete(true);
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Hududlar ro'yxati</h1>

        <div className="flex gap-2 mb-4">
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
                  {editingPlan ? "Hududni tahrirlash" : "Yangi hudud qo'shish"}
                </DialogTitle>
              </DialogHeader>

              <AddedRegion
                initialValues={editingPlan}
                setDialogOpen={setDialogOpen}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {data && (
        <RegionTable
          region={data!}
          handleDelete={handleDelete}
          isError={isError}
          setDialogOpen={setDialogOpen}
          isLoading={isLoading}
          setEditingRegion={setEditingPlan}
        />
      )}
      <DeleteRegion
        opneDelete={opneDelete}
        regionDelete={regionDelete}
        setOpenDelete={setOpenDelete}
        setRegionDelete={setRegionDelete}
      />
    </div>
  );
};

export default RegionList;

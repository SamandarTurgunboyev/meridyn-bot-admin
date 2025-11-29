import { object_api } from "@/features/objects/lib/api";
import { ObjectListData } from "@/features/objects/lib/data";
import DeleteObject from "@/features/objects/ui/DeleteObject";
import ObjectDetailDialog from "@/features/objects/ui/ObjectDetail";
import ObjectFilter from "@/features/objects/ui/ObjectFilter";
import ObjectTable from "@/features/objects/ui/ObjectTable";
import Pagination from "@/shared/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ObjectList() {
  const [detail, setDetail] = useState<ObjectListData | null>(null);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<ObjectListData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const [searchName, setSearchName] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const [disricDelete, setDiscritDelete] = useState<ObjectListData | null>(
    null,
  );
  const [opneDelete, setOpenDelete] = useState<boolean>(false);

  const handleDelete = (user: ObjectListData) => {
    setDiscritDelete(user);
    setOpenDelete(true);
  };

  const {
    data: object,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "object_list",
      searchDistrict,
      currentPage,
      searchName,
      searchUser,
    ],
    queryFn: () =>
      object_api.list({
        district: searchDistrict,
        limit,
        offset: (currentPage - 1) * limit,
        name: searchName,
        user: searchUser,
      }),
    select(data) {
      return data.data.data;
    },
  });

  const totalPages = object ? Math.ceil(object.count / 20) : 1;

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Obyektlarni boshqarish</h1>
        <ObjectFilter
          dialogOpen={dialogOpen}
          editingPlan={editingPlan}
          searchDistrict={searchDistrict}
          searchName={searchName}
          searchUser={searchUser}
          setDialogOpen={setDialogOpen}
          setEditingPlan={setEditingPlan}
          setSearchDistrict={setSearchDistrict}
          setSearchName={setSearchName}
          setSearchUser={setSearchUser}
        />
        <ObjectDetailDialog
          detail={detailDialog}
          setDetail={setDetailDialog}
          object={detail}
        />
      </div>

      <ObjectTable
        filteredData={object ? object.results : []}
        handleDelete={handleDelete}
        isError={isError}
        isLoading={isLoading}
        setDetail={setDetail}
        setDetailDialog={setDetailDialog}
        setDialogOpen={setDialogOpen}
        setEditingPlan={setEditingPlan}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DeleteObject
        discrit={disricDelete}
        opneDelete={opneDelete}
        setDiscritDelete={setDiscritDelete}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
}

import { pharmacies_api } from "@/features/pharmacies/lib/api";
import { type PharmaciesListData } from "@/features/pharmacies/lib/data";
import DeletePharmacies from "@/features/pharmacies/ui/DeletePharmacies";
import PharmaciesFilter from "@/features/pharmacies/ui/PharmaciesFilter";
import PharmaciesTable from "@/features/pharmacies/ui/PharmaciesTable";
import PharmDetailDialog from "@/features/pharmacies/ui/PharmDetailDialog";
import Pagination from "@/shared/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const PharmaciesList = () => {
  const [detail, setDetail] = useState<PharmaciesListData | null>(null);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<PharmaciesListData | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [disricDelete, setDiscritDelete] = useState<PharmaciesListData | null>(
    null,
  );
  const [opneDelete, setOpenDelete] = useState<boolean>(false);
  const limit = 20;

  const [searchName, setSearchName] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchObject, setSearchObject] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const { data: pharmacies } = useQuery({
    queryKey: [
      "pharmacies_list",
      currentPage,
      searchDistrict,
      searchName,
      searchObject,
      searchUser,
    ],
    queryFn: () =>
      pharmacies_api.list({
        district: searchDistrict,
        offset: (currentPage - 1) * limit,
        limit: limit,
        name: searchName,
        place: searchObject,
        user: searchUser,
      }),
    select(data) {
      return data.data.data;
    },
  });

  const totalPages = pharmacies ? Math.ceil(pharmacies.count / limit) : 1;

  const handleDelete = (user: PharmaciesListData) => {
    setDiscritDelete(user);
    setOpenDelete(true);
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl font-bold">Dorixonalarni boshqarish</h1>

          <PharmaciesFilter
            dialogOpen={dialogOpen}
            editingPlan={editingPlan}
            searchDistrict={searchDistrict}
            searchName={searchName}
            searchObject={searchObject}
            searchUser={searchUser}
            setDialogOpen={setDialogOpen}
            setEditingPlan={setEditingPlan}
            setSearchDistrict={setSearchDistrict}
            setSearchName={setSearchName}
            setSearchObject={setSearchObject}
            setSearchUser={setSearchUser}
          />
        </div>

        <PharmDetailDialog
          detail={detailDialog}
          setDetail={setDetailDialog}
          object={detail}
        />
      </div>

      <PharmaciesTable
        filteredData={pharmacies ? pharmacies.results : []}
        handleDelete={handleDelete}
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

      <DeletePharmacies
        discrit={disricDelete}
        opneDelete={opneDelete}
        setDiscritDelete={setDiscritDelete}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
};

export default PharmaciesList;

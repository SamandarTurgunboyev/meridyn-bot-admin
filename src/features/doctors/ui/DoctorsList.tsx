import { doctor_api } from "@/features/doctors/lib/api";
import { type DoctorListResData } from "@/features/doctors/lib/data";
import DeleteDoctor from "@/features/doctors/ui/DeleteDoctor";
import DoctorDetailDialog from "@/features/doctors/ui/DoctorDetailDialog";
import FilterDoctor from "@/features/doctors/ui/FilterDoctor";
import TableDoctor from "@/features/doctors/ui/TableDoctor";
import Pagination from "@/shared/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const DoctorsList = () => {
  const [detail, setDetail] = useState<DoctorListResData | null>(null);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<DoctorListResData | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchName, setSearchName] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchObject, setSearchObject] = useState("");
  const [searchWork, setSearchWork] = useState("");
  const [searchSpec, setSearchSpec] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const [disricDelete, setDiscritDelete] = useState<DoctorListResData | null>(
    null,
  );
  const [opneDelete, setOpenDelete] = useState<boolean>(false);

  const limit = 20;

  const {
    data: doctor,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "doctor_list",
      currentPage,
      searchDistrict,
      searchName,
      searchObject,
      searchWork,
      searchSpec,
      searchUser,
    ],
    queryFn: () =>
      doctor_api.list({
        limit,
        offset: (currentPage - 1) * limit,
        district_name: searchDistrict,
        full_name: searchName,
        place_name: searchObject,
        work_place: searchWork,
        sphere: searchSpec,
        user: searchUser,
      }),
    select(data) {
      return data.data.data;
    },
  });

  const handleDelete = (user: DoctorListResData) => {
    setDiscritDelete(user);
    setOpenDelete(true);
  };

  const totalPages = doctor ? Math.ceil(doctor.count / limit) : 1;

  return (
    <div className="flex flex-col h-full p-10 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl font-bold">Shifokorlarni boshqarish</h1>

          <FilterDoctor
            dialogOpen={dialogOpen}
            editingPlan={editingPlan}
            searchDistrict={searchDistrict}
            searchName={searchName}
            searchObject={searchObject}
            searchSpec={searchSpec}
            searchUser={searchUser}
            searchWork={searchWork}
            setDialogOpen={setDialogOpen}
            setEditingPlan={setEditingPlan}
            setSearchDistrict={setSearchDistrict}
            setSearchName={setSearchName}
            setSearchObject={setSearchObject}
            setSearchSpec={setSearchSpec}
            setSearchUser={setSearchUser}
            setSearchWork={setSearchWork}
          />
        </div>

        <DoctorDetailDialog
          detail={detailDialog}
          setDetail={setDetailDialog}
          object={detail}
        />
      </div>

      <TableDoctor
        isError={isError}
        isLoading={isLoading}
        doctor={doctor ? doctor.results : []}
        setDetail={setDetail}
        handleDelete={handleDelete}
        isFetching={isFetching}
        setDetailDialog={setDetailDialog}
        setDialogOpen={setDialogOpen}
        setEditingPlan={setEditingPlan}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DeleteDoctor
        discrit={disricDelete}
        opneDelete={opneDelete}
        setDiscritDelete={setDiscritDelete}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
};

export default DoctorsList;

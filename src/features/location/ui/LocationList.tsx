import { location_api } from "@/features/location/lib/api";
import { type LocationListDataRes } from "@/features/location/lib/data";
import DeleteLocation from "@/features/location/ui/DeleteLocation";
import LocationDetailDialog from "@/features/location/ui/LocationDetailDialog";
import LocationFilter from "@/features/location/ui/LocationFilter";
import LocationTable from "@/features/location/ui/LocationTable";
import UserLocationTable from "@/features/location/ui/UserLocationTable";
import formatDate from "@/shared/lib/formatDate";
import Pagination from "@/shared/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const LocationList = () => {
  const [detail, setDetail] = useState<LocationListDataRes | null>(null);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [searchUser, setSearchUser] = useState<string>("");
  const [viewLocation, setViewLocation] = useState<
    "user_send" | "user_send_object"
  >("user_send_object");
  const [open, setOpen] = useState<boolean>(false);

  const { data: location } = useQuery({
    queryKey: ["location_list", currentPage, searchUser, dateFilter],
    queryFn: () =>
      location_api.list({
        limit,
        offset: (currentPage - 1) * limit,
        user: searchUser,
        date: dateFilter && formatDate.format(dateFilter, "YYYY-MM-DD"),
      }),
    select(data) {
      return data.data.data;
    },
  });

  const { data: user_location } = useQuery({
    queryKey: ["user_location_list", currentPage, searchUser, dateFilter],
    queryFn: () =>
      location_api.list_user_location({
        limit,
        offset: (currentPage - 1) * limit,
        user: searchUser,
        date: dateFilter && formatDate.format(dateFilter, "YYYY-MM-DD"),
      }),
    select(data) {
      return data.data.data;
    },
  });

  const totalPages = location ? Math.ceil(location.count / limit) : 1;

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [locationDelete, setLocationDelete] =
    useState<LocationListDataRes | null>(null);

  const handleDelete = (id: LocationListDataRes) => {
    setOpenDelete(true);
    setLocationDelete(id);
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Jo'natilgan lokatsiyalar</h1>

        <LocationFilter
          dateFilter={dateFilter}
          open={open}
          searchUser={searchUser}
          setDateFilter={setDateFilter}
          setOpen={setOpen}
          setSearchUser={setSearchUser}
          setViewLocation={setViewLocation}
          viewLocation={viewLocation}
        />

        <LocationDetailDialog
          detail={detailDialog}
          setDetail={setDetailDialog}
          object={detail}
        />
      </div>
      {viewLocation === "user_send_object" && (
        <>
          <LocationTable
            filtered={location ? location.results : []}
            handleDelete={handleDelete}
            setDetail={setDetail}
            setDetailDialog={setDetailDialog}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </>
      )}

      {viewLocation === "user_send" && (
        <>
          <UserLocationTable
            filtered={user_location ? user_location.results : []}
            handleDelete={handleDelete}
            setDetail={setDetail}
            setDetailDialog={setDetailDialog}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </>
      )}

      <DeleteLocation
        locationDelete={locationDelete}
        opneDelete={openDelete}
        setOpenDelete={setOpenDelete}
        setLocationDelete={setLocationDelete}
        viewLocation={viewLocation}
      />
    </div>
  );
};

export default LocationList;

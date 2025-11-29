import {
  LocationFakeData,
  type LocationListType,
} from "@/features/location/lib/data";
import LocationDetailDialog from "@/features/location/ui/LocationDetailDialog";
import LocationFilter from "@/features/location/ui/LocationFilter";
import LocationTable from "@/features/location/ui/LocationTable";
import Pagination from "@/shared/ui/pagination";
import { useMemo, useState } from "react";

const LocationList = () => {
  const [data, setData] = useState<LocationListType[]>(LocationFakeData);
  const [detail, setDetail] = useState<LocationListType | null>(null);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Filter state
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [searchUser, setSearchUser] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((e) => e.id !== id));
  };

  // Filtered data
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const dateMatch = dateFilter
        ? item.createdAt.toDateString() === dateFilter.toDateString()
        : true;

      const userMatch = `${item.user.firstName} ${item.user.lastName}`
        .toLowerCase()
        .includes(searchUser.toLowerCase());

      return dateMatch && userMatch;
    });
  }, [data, dateFilter, searchUser]);

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
        />

        <LocationDetailDialog
          detail={detailDialog}
          setDetail={setDetailDialog}
          object={detail}
        />
      </div>

      <LocationTable
        filtered={filtered}
        handleDelete={handleDelete}
        setDetail={setDetail}
        setDetailDialog={setDetailDialog}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default LocationList;

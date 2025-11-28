import { discrit_api } from "@/features/districts/lib/api";
import { type DistrictListData } from "@/features/districts/lib/data";
import DeleteDiscrit from "@/features/districts/ui/DeleteDiscrit";
import Filter from "@/features/districts/ui/Filter";
import PaginationDistrict from "@/features/districts/ui/PaginationDistrict";
import TableDistrict from "@/features/districts/ui/TableDistrict";
import { useQuery } from "@tanstack/react-query";

import { useState } from "react";

const DistrictsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingDistrict, setEditingDistrict] =
    useState<DistrictListData | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["discrit_list", currentPage, search],
    queryFn: () =>
      discrit_api.list({
        limit: 20,
        offset: (currentPage - 1) * 20,
        name: search,
      }),
    select(data) {
      return data.data.data;
    },
  });

  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  const [dialogOpen, setDialogOpen] = useState(false);

  const [disricDelete, setDiscritDelete] = useState<DistrictListData | null>(
    null,
  );
  const [opneDelete, setOpenDelete] = useState<boolean>(false);

  const handleDelete = (user: DistrictListData) => {
    setDiscritDelete(user);
    setOpenDelete(true);
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Tumanlar ro‘yxati</h1>

        <Filter
          search={search}
          setSearch={setSearch}
          dialogOpen={dialogOpen}
          editing={editingDistrict}
          setDialogOpen={setDialogOpen}
          setEditing={setEditingDistrict}
        />
      </div>

      <TableDistrict
        data={data ? data.results : []}
        isError={isError}
        isLoading={isLoading}
        setDialogOpen={setDialogOpen}
        setEditingDistrict={setEditingDistrict}
        handleDelete={handleDelete}
        currentPage={currentPage}
      />

      <PaginationDistrict
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DeleteDiscrit
        discrit={disricDelete}
        setDiscritDelete={setDiscritDelete}
        opneDelete={opneDelete}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
};

export default DistrictsList;

import {
  PharmciesData,
  type PharmciesType,
} from "@/features/pharmacies/lib/data";
import AddedPharmacies from "@/features/pharmacies/ui/AddedPharmacies";
import PharmDetailDialog from "@/features/pharmacies/ui/PharmDetailDialog";
import formatPhone from "@/shared/lib/formatPhone";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

const PharmaciesList = () => {
  const [data, setData] = useState<PharmciesType[]>(PharmciesData);
  const [detail, setDetail] = useState<PharmciesType | null>(null);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<PharmciesType | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const [searchName, setSearchName] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchObject, setSearchObject] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((e) => e.id !== id));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const nameMatch = `${item.name}`
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const districtMatch = item.district.name
        .toLowerCase()
        .includes(searchDistrict.toLowerCase());
      const objectMatch = item.object.name
        .toLowerCase()
        .includes(searchObject.toLowerCase());
      const userMatch = `${item.user.firstName} ${item.user.lastName}`
        .toLowerCase()
        .includes(searchUser.toLowerCase());

      return nameMatch && districtMatch && objectMatch && userMatch;
    });
  }, [data, searchName, searchDistrict, searchObject, searchUser]);

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl font-bold">Dorixonalrni boshqarish</h1>

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
                  setData={setData}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <PharmDetailDialog
          detail={detailDialog}
          setDetail={setDetailDialog}
          object={detail}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Dorixona nomi</TableHead>
              <TableHead>Inn</TableHead>
              <TableHead>Egasining nomeri</TableHead>
              <TableHead>Ma'sul shaxsning nomeri</TableHead>
              <TableHead>Tuman</TableHead>
              <TableHead>Obyekt</TableHead>
              <TableHead>Kim qo'shgan</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.inn}</TableCell>
                <TableCell>{formatPhone(item.phone_number)}</TableCell>
                <TableCell>{formatPhone(item.additional_phone)}</TableCell>
                <TableCell>{item.district.name}</TableCell>
                <TableCell>{item.object.name}</TableCell>
                <TableCell>
                  {item.user.firstName} {item.user.lastName}
                </TableCell>

                <TableCell className="text-right flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setDetail(item);
                      setDetailDialog(true);
                    }}
                    className="bg-green-600 text-white cursor-pointer hover:bg-green-600 hover:text-white"
                  >
                    <Eye size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-600 hover:text-white"
                    onClick={() => {
                      setEditingPlan(item);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-2 sticky bottom-0 bg-white flex justify-end gap-2 z-10 py-2 border-t">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          className="cursor-pointer"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <ChevronLeft />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            size="icon"
            className={clsx(
              currentPage === i + 1
                ? "bg-blue-500 hover:bg-blue-500"
                : " bg-none hover:bg-blue-200",
              "cursor-pointer",
            )}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="cursor-pointer"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default PharmaciesList;

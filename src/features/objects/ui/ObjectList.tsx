import {
  ObjectListData,
  type ObjectListType,
} from "@/features/objects/lib/data";
import AddedObject from "@/features/objects/ui/AddedObject";
import ObjectDetailDialog from "@/features/objects/ui/ObjectDetail";
import { Badge } from "@/shared/ui/badge";
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

export default function ObjectList() {
  const [data, setData] = useState<ObjectListType[]>(ObjectListData);
  const [detail, setDetail] = useState<ObjectListType | null>(null);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<ObjectListType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Filter state
  const [searchName, setSearchName] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((e) => e.id !== id));
  };

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const nameMatch = item.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const districtMatch = item.district.name
        .toLowerCase()
        .includes(searchDistrict.toLowerCase());
      const userMatch = `${item.user.firstName} ${item.user.lastName}`
        .toLowerCase()
        .includes(searchUser.toLowerCase());

      return nameMatch && districtMatch && userMatch;
    });
  }, [data, searchName, searchDistrict, searchUser]);

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Obyektlarni boshqarish</h1>

        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <Input
            placeholder="Obyekt nomi"
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
            placeholder="Foydalanuvchi"
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
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingPlan
                    ? "Obyektni tahrirlash"
                    : "Yangi obyekt qo'shish"}
                </DialogTitle>
              </DialogHeader>

              <AddedObject
                initialValues={editingPlan}
                setDialogOpen={setDialogOpen}
                setData={setData}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ObjectDetailDialog
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
              <TableHead>Obyekt nomi</TableHead>
              <TableHead>Tuman</TableHead>
              <TableHead>Foydalanuvchi</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.district.name}</Badge>
                </TableCell>
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
}

import { fakeDistrict, type District } from "@/features/districts/lib/data";
import AddDistrict from "@/features/districts/ui/AddDistrict";
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

import { ChevronLeft, ChevronRight, Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";

const DistrictsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const [districts, setDistricts] = useState<District[]>(fakeDistrict);

  const [search, setSearch] = useState("");

  const [userSearch, setUserSearch] = useState("");

  const [editing, setEditing] = useState<District | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = districts.filter((d) => {
    return (
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      `${d.user.firstName} ${d.user.lastName}`
        .toLowerCase()
        .includes(userSearch.toLowerCase())
    );
  });

  function deleteDistrict(id: number) {
    setDistricts((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Tumanlar ro‘yxati</h1>

        <div className="flex gap-4 justify-end">
          <Input
            placeholder="Tuman nomi bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm h-12"
          />

          <Input
            placeholder="Foydalanuvchi bo‘yicha qidirish..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="max-w-sm h-12"
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditing(null)}
                className="bg-blue-500 h-12 cursor-pointer hover:bg-blue-500"
              >
                <Plus className="w-5 h-5 mr-1" /> Tuman qo‘shish
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editing ? "Tumanni tahrirlash" : "Yangi tuman qo‘shish"}
                </DialogTitle>
              </DialogHeader>

              <AddDistrict
                initialValues={editing}
                setDistricts={setDistricts}
                setDialogOpen={setDialogOpen}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tuman nomi</TableHead>
              <TableHead>Kim qo‘shgan</TableHead>
              <TableHead className="text-right">Harakatlar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>
                  {d.user.firstName} {d.user.lastName}
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(d);
                      setDialogOpen(true);
                    }}
                    className="bg-blue-500 text-white hover:text-white hover:bg-blue-500 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDistrict(d.id)}
                    className="cursor-pointer"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Hech qanday tuman topilmadi
                </TableCell>
              </TableRow>
            )}
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

export default DistrictsList;

import SidebarLayout from "@/SidebarLayout";
import { FakeUserList, type User } from "@/features/users/lib/data";
import AddUsers from "@/features/users/ui/AddUsers";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
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
import { useMemo, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>(FakeUserList);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Filter & search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      const matchesRegion =
        regionFilter === "all" || user.region === regionFilter;

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [users, searchTerm, statusFilter, regionFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Hududlarni filter qilish uchun
  const regions = Array.from(new Set(users.map((u) => u.region)));

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full p-10 w-full">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">Foydalanuvchilar ro'yxati</h1>

          <div className="flex flex-wrap gap-2 items-center">
            <Input
              type="text"
              placeholder="Ism yoki Familiyasi bo'yicha qidirish"
              className="border rounded px-3 py-2 text-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={statusFilter}
              onValueChange={(val) =>
                setStatusFilter(val as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Holati" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="inactive">Faol emas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={regionFilter}
              onValueChange={(val) => setRegionFilter(val)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Hududi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="bg-blue-500 cursor-pointer hover:bg-blue-500"
                  onClick={() => setEditingUser(null)}
                >
                  <Plus className="!h-5 !w-5" /> Qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser
                      ? "Foydalanuvchini tahrirlash"
                      : "Foydalanuvchi qo'shish"}
                  </DialogTitle>
                </DialogHeader>

                <AddUsers
                  initialData={editingUser}
                  setUsers={setUsers}
                  setDialogOpen={setDialogOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-[16px] text-center">
                <TableHead className="text-start">ID</TableHead>
                <TableHead className="text-start">Ismi</TableHead>
                <TableHead className="text-start">Familiyasi</TableHead>
                <TableHead className="text-start">Hududi</TableHead>
                <TableHead className="text-center">Holati</TableHead>
                <TableHead className="text-right">Harakatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="text-[14px] text-start">
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.region}</TableCell>
                    <TableCell>
                      <Select
                        value={user.isActive ? "active" : "inactive"}
                        onValueChange={(val) => {
                          setUsers(
                            users.map((u) =>
                              u.id === user.id
                                ? { ...u, isActive: val === "active" }
                                : u,
                            ),
                          );
                        }}
                      >
                        <SelectTrigger
                          className={clsx(
                            "w-[180px] mx-auto",
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800",
                          )}
                        >
                          <SelectValue placeholder="Holati" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="active"
                            className="text-green-500 hover:!text-green-500"
                          >
                            Faol
                          </SelectItem>
                          <SelectItem
                            value="inactive"
                            className="text-red-500 hover:!text-red-500"
                          >
                            Faol emas
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setDialogOpen(true);
                        }}
                        className="bg-blue-500 text-white hover:bg-blue-500 hover:text-white cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-lg">
                    Foydalanuvchilar topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-2 sticky bottom-0 bg-white flex justify-end gap-2 z-10 py-2 border-t">
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            disabled={currentPage === 1}
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
            className="cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default UsersList;

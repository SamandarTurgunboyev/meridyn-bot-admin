import {
  LocationFakeData,
  type LocationListType,
} from "@/features/location/lib/data";
import LocationDetailDialog from "@/features/location/ui/LocationDetailDialog";
import formatDate from "@/shared/lib/formatDate";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
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
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
} from "lucide-react";
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

        <div className="flex gap-2 w-full md:w-auto">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal h-12"
              >
                {dateFilter ? dateFilter.toDateString() : "Sana"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateFilter}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDateFilter(date);
                  setOpen(false);
                }}
              />
              <div className="p-2 border-t bg-white">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setDateFilter(undefined);
                    setOpen(false);
                  }}
                >
                  Tozalash
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Input
            type="text"
            placeholder="Foydalanuvchi ismi"
            className="h-12"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>

        <LocationDetailDialog
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
              <TableHead>Jo'natgan foydalanuvchi</TableHead>
              <TableHead>Jo'natgan vaqti</TableHead>
              <TableHead>Qayerdan jo'natdi</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {item.user.firstName} {item.user.lastName}
                </TableCell>
                <TableCell>
                  {formatDate.format(item.createdAt, "DD-MM-YYYY")}
                </TableCell>

                <TableCell>
                  {item.district
                    ? "Tuman"
                    : item.object
                      ? "Obyekt"
                      : item.doctor
                        ? "Shifokor"
                        : item.pharmcies
                          ? "Dorixona"
                          : "Turgan joyidan"}
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

export default LocationList;

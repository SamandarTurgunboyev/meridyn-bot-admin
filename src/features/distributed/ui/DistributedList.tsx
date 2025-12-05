import { distributed_api } from "@/features/distributed/lib/api";
import type { DistributedListData } from "@/features/distributed/lib/data";
import { DistributedDetail } from "@/features/distributed/ui/SpecificationDetail ";
import formatDate from "@/shared/lib/formatDate";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Input } from "@/shared/ui/input";
import Pagination from "@/shared/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, Eye, Loader2 } from "lucide-react";
import { useState } from "react";

const DistributedList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState<string>("");
  const limit = 20;
  const [disctritFilter, setDisctritFilter] = useState<string>("");
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [supportDetail, setSupportDetail] =
    useState<DistributedListData | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "distributed_list",
      currentPage,
      nameFilter,
      disctritFilter,
      dateFilter,
    ],
    queryFn: () =>
      distributed_api.list({
        limit,
        offset: (currentPage - 1) * limit,
        product: nameFilter,
        user: disctritFilter,
        date: dateFilter && formatDate.format(dateFilter, "YYYY-MM-DD"),
      }),
    select(data) {
      return data.data.data;
    },
  });

  const totalPages = data ? Math.ceil(data?.count / limit) : 1;

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Yordam so'rovlari ro'yxati</h1>

        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Foydalanuvchi nomi"
            className="h-12"
            value={disctritFilter}
            onChange={(e) => setDisctritFilter(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Mahsulot nomi"
            className="h-12"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />

          <Popover open={openDate} onOpenChange={setOpenDate}>
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
                  setOpenDate(false);
                }}
              />
              <div className="p-2 border-t bg-white">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setDateFilter(undefined);
                    setOpenDate(false);
                  }}
                >
                  Tozalash
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {isLoading && (
          <div className="h-full flex items-center justify-center bg-white/70 z-10">
            <span className="text-lg font-medium">
              <Loader2 className="animate-spin" />
            </span>
          </div>
        )}

        {isError && (
          <div className="h-full flex items-center justify-center z-10">
            <span className="text-lg font-medium text-red-600">
              Ma'lumotlarni olishda xatolik yuz berdi.
            </span>
          </div>
        )}
        {!isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="text-start">ID</TableHead>
                <TableHead className="text-start">Kim qo'shgan</TableHead>
                <TableHead className="text-start">Xaridorning ismi</TableHead>
                <TableHead className="text-start">Mahsulot nomi</TableHead>
                <TableHead className="text-start">Nechta berilgan</TableHead>
                <TableHead className="text-start">Topshirilgan sana</TableHead>
                <TableHead className="text-start">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.results.length > 0 ? (
                data?.results.map((plan) => (
                  <TableRow key={plan.id} className="text-start">
                    <TableCell>{plan.id}</TableCell>
                    <TableCell>
                      {plan.user.first_name} {plan.user.last_name}
                    </TableCell>
                    <TableCell>{plan.employee_name}</TableCell>
                    <TableCell>{plan.product.name}</TableCell>
                    <TableCell>{plan.quantity}</TableCell>
                    <TableCell>
                      {formatDate.format(plan.date, "YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      <Button
                        className="bg-blue-500 hover:bg-blue-500 cursor-pointer"
                        onClick={() => {
                          setOpen(true);
                          setSupportDetail(plan);
                        }}
                      >
                        <Eye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-lg">
                    Farmasevtika topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DistributedDetail
        open={open}
        setOpen={setOpen}
        specification={supportDetail}
      />
    </div>
  );
};

export default DistributedList;

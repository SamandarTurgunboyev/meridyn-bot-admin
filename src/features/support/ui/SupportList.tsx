import { support_api } from "@/features/support/lib/api";
import type { SupportListData } from "@/features/support/lib/data";
import SupportDetail from "@/features/support/ui/SupportDetail";
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
import { useEffect, useState } from "react";

const SupportList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [disctritFilter, setDisctritFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [supportDetail, setSupportDetail] = useState<SupportListData | null>(
    null,
  );
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (disctritFilter?.length === 0) {
      setDisctritFilter(null);
    }
  }, [disctritFilter]);

  const limit = 20;
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "factory_list",
      currentPage,
      nameFilter,
      disctritFilter,
      dateFilter,
    ],
    queryFn: () => {
      const params: {
        limit?: number;
        offset?: number;
        problem?: string;
        district?: string;
        user?: string;
        date?: string;
      } = {
        limit: limit,
        offset: (currentPage - 1) * limit,
        user: nameFilter,
      };

      if (disctritFilter !== null) {
        params.district = disctritFilter;
      }

      if (dateFilter) {
        params.date = formatDate.format(dateFilter, "YYYY-MM-DD");
      }

      return support_api.list(params);
    },
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
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Tuman nomi"
            className="h-12"
            value={disctritFilter ?? ""}
            onChange={(e) => setDisctritFilter(e.target.value)}
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
                <TableHead className="text-start">Kim jo'natgan</TableHead>
                <TableHead className="text-start">Habar haqida</TableHead>
                <TableHead className="text-start">Habar turi</TableHead>
                <TableHead className="text-start">Tuman</TableHead>
                <TableHead className="text-start">Jo'natilgan sanasi</TableHead>
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
                    <TableCell>{plan.problem.slice(0, 50)}...</TableCell>
                    <TableCell>
                      {plan.type === "PROBLEM"
                        ? "Muommo hal qilish"
                        : "Yordam so'rash"}
                    </TableCell>
                    <TableCell>
                      {plan.district ? plan.district.name : "-"}
                    </TableCell>
                    <TableCell>{plan.date}</TableCell>
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

      <SupportDetail
        open={open}
        setOpen={setOpen}
        supportDetail={supportDetail}
      />
    </div>
  );
};

export default SupportList;

import { Button } from "@/shared/ui/button";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

interface Props {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const PaginationDistrict = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: Props) => {
  return (
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
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        className="cursor-pointer"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default PaginationDistrict;

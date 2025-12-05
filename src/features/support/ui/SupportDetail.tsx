import type { SupportListData } from "@/features/support/lib/data";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import type { Dispatch, SetStateAction } from "react";

const SupportDetail = ({
  open,
  setOpen,
  supportDetail,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  supportDetail: SupportListData | null;
}) => {
  if (supportDetail === null) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batafsil</DialogTitle>
          <DialogDescription className="mt-5 flex flex-col gap-2">
            <p className="text-black text-lg font-medium">
              <span className="text-foreground">Kim jo'natgan:</span>{" "}
              {supportDetail?.user.first_name} {supportDetail?.user.last_name}
            </p>
            {supportDetail?.district && (
              <p className="text-black text-lg font-medium">
                <span className="text-foreground">Tuman nomi:</span>{" "}
                {supportDetail?.district?.name}
              </p>
            )}
            <p className="text-black text-lg font-medium">
              <span className="text-foreground">Jo'natilgan vaqti:</span>{" "}
              {supportDetail?.date}
            </p>
            <p className="text-black text-lg font-medium">
              <span className="text-foreground">Xabar turi:</span>{" "}
              {supportDetail?.type === "PROBLEM"
                ? "Muommo hal qilish"
                : "Yordam so'rash"}
            </p>
            <p className="text-black text-lg font-medium">
              <span className="text-foreground">Xabar tavsifi:</span>{" "}
              {supportDetail?.problem}
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5">
          <Button
            className="bg-blue-500 hover:bg-blue-500 cursor-pointer w-32 h-12 text-md"
            onClick={() => {
              setOpen(false);
            }}
          >
            Yopish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupportDetail;

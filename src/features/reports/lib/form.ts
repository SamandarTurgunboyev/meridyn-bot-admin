import z from "zod";

export const reportsForm = z.object({
  pharm_name: z.string().min(1, { message: "Majburiy maydon" }),
  amount: z.string().min(1, { message: "Majburiy maydon" }),
});

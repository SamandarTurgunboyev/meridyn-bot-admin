import z from "zod";

export const tourPlanForm = z.object({
  district: z.string().min(1, { message: "Majburiy maydon" }),
  user: z.string().min(1, { message: "Majburiy maydon" }),
  date: z.date().min(1, { message: "Majburiy maydon" }),
});

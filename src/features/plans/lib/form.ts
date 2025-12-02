import z from "zod";

export const createPlanFormData = z.object({
  name: z.string().min(1, { message: "Majburiy maydon" }),
  description: z.string().min(1, { message: "Majburiy maydon" }),
  user: z.string().min(1, { message: "Majburiy maydon" }),
  date: z.string().min(1, { message: "Majburiy maydon" }),
});

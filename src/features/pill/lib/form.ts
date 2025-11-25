import z from "zod";

export const createPillFormData = z.object({
  name: z.string().min(1, { message: "Majburiy maydon" }),
  price: z.string().min(1, { message: "Majburiy maydon" }),
});

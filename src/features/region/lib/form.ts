import z from "zod";

export const regionForm = z.object({
  name: z.string().min(1, { message: "Majburiy maydon" }),
});

import z from "zod";

export const pharmForm = z.object({
  name: z.string().min(1, { message: "Majburiy maydon" }),
});

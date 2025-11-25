import z from "zod";

export const AddedUser = z.object({
  firstName: z.string().min(1, { message: "Majburiy maydon" }),
  lastName: z.string().min(1, { message: "Majburiy maydon" }),
  region: z.string().min(1, { message: "Majburiy maydon" }),
  isActive: z.string().min(1, { message: "Majburiy maydon" }),
});

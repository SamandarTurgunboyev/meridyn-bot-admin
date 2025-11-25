import z from "zod";

export const ObjectForm = z.object({
  name: z.string().min(1, { message: "Majburiy maydon" }),
  district: z.string().min(1, { message: "Majburiy maydon" }),
  user: z.string().min(1, { message: "Majburiy maydon" }),
  long: z.string().min(1, { message: "Majburiy maydon" }),
  lat: z.string().min(1, { message: "Majburiy maydon" }),
});

import z from "zod";

export const PharmForm = z.object({
  name: z.string().min(1, { message: "Majburiy maydon" }),
  inn: z.string().min(1, { message: "Majburiy maydon" }),
  phone_number: z.string().min(1, { message: "Majburiy maydon" }),
  additional_phone: z.string().min(1, { message: "Majburiy maydon" }),
  district: z.string().min(1, { message: "Majburiy maydon" }),
  user: z.string().min(1, { message: "Majburiy maydon" }),
  object: z.string().min(1, { message: "Majburiy maydon" }),
  long: z.string().min(1, { message: "Majburiy maydon" }),
  lat: z.string().min(1, { message: "Majburiy maydon" }),
});

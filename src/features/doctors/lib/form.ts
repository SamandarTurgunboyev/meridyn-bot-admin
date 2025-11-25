import z from "zod";

export const DoctorForm = z.object({
  first_name: z.string().min(1, { message: "Majburiy maydon" }),
  last_name: z.string().min(1, { message: "Majburiy maydon" }),
  phone_number: z.string().min(1, { message: "Majburiy maydon" }),
  work: z.string().min(1, { message: "Majburiy maydon" }),
  spec: z.string().min(1, { message: "Majburiy maydon" }),
  desc: z.string().min(1, { message: "Majburiy maydon" }),
  district: z.string().min(1, { message: "Majburiy maydon" }),
  user: z.string().min(1, { message: "Majburiy maydon" }),
  object: z.string().min(1, { message: "Majburiy maydon" }),
  long: z.string().min(1, { message: "Majburiy maydon" }),
  lat: z.string().min(1, { message: "Majburiy maydon" }),
});

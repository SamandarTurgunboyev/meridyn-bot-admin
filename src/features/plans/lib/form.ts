import z from "zod";

export const createPlanFormData = z.object({
  name: z.string().optional(),
  description: z.string().min(1, { message: "Majburiy maydon" }),
  user: z.string().min(1, { message: "Majburiy maydon" }),
  date: z.string().min(1, { message: "Majburiy maydon" }),
  doctor_id: z.string().optional(),
  pharmacy_id: z.string().optional(),
});

//   longitude: number;
//   latitude: number;
//   extra_location: { longitude: number; latitude: number };

import z from "zod";

export const SpecificationsForm = z.object({
  pharm: z.string().min(1, { message: "Majburiy maydon" }),
  user: z.string().min(1, { message: "Majburiy maydon" }),
  client: z.string().min(1, { message: "Majburiy maydon" }),
  percentage: z.number().min(0, { message: "Majburiy maydon" }),
  totalPrice: z.number().min(0),
  paidPrice: z.number().min(0),
  medicines: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      count: z.number().min(0),
    }),
  ),
});

export type SpecificationsFormType = z.infer<typeof SpecificationsForm>;

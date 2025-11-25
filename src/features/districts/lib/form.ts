import z from "zod";

export const addDistrict = z.object({
  name: z.string().min(2, "Tuman nomi kamida 2 ta harf bo‘lishi kerak"),
  userId: z.string().min(1, "Foydalanuvchini tanlang"),
});

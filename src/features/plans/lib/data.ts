import type { User } from "@/features/users/lib/data";

export interface Plan {
  id: number;
  name: string;
  description: string;
  user: User;
  status: "Bajarildi" | "Bajarilmagan";
  createdAt: Date;
}

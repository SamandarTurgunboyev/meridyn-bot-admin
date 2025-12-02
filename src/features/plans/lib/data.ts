import type { User } from "@/features/users/lib/data";

export interface Plan {
  id: number;
  name: string;
  description: string;
  user: User;
  status: "Bajarildi" | "Bajarilmagan";
  createdAt: Date;
}

export interface PlanListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: null | string;
    previous: null | string;
    results: PlanListData[];
  };
}

export interface PlanListData {
  id: number;
  title: string;
  description: string;
  date: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  is_done: true;
  created_at: string;
}

export interface PlanCreateReq {
  title: string;
  description: string;
  date: string;
  user_id: number;
}

export interface PlanUpdateReq {
  title: string;
  description: string;
  date: string;
}

import { FakeUserList, type User } from "@/features/users/lib/data";

export interface District {
  id: number;
  name: string;
  user: User;
}

export const fakeDistrict: District[] = [
  {
    id: 1,
    name: "Chilonzor",
    user: FakeUserList[0],
  },
  {
    id: 2,
    name: "Yunusobod",
    user: FakeUserList[1],
  },
  {
    id: 3,
    name: "Urgut",
    user: FakeUserList[2],
  },
];

export interface DistrictListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: DistrictListData[];
  };
}

export interface DistrictListData {
  id: number;
  name: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

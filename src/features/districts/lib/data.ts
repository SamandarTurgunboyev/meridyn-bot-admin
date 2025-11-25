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

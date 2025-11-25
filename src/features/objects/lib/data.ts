import { fakeDistrict, type District } from "@/features/districts/lib/data";
import { FakeUserList, type User } from "@/features/users/lib/data";

export interface ObjectListType {
  id: number;
  name: string;
  district: District;
  user: User;
  long: string;
  lat: string;
  moreLong: string[];
}

export const ObjectListData: ObjectListType[] = [
  {
    id: 1,
    name: "Sport Kompleksi A",
    district: fakeDistrict[0],
    user: FakeUserList[0],
    long: "69.2361",
    lat: "41.2949",
    moreLong: ["41.2949", "69.2361"],
  },
  {
    id: 2,
    name: "Fitnes Markazi B",
    district: fakeDistrict[1],
    user: FakeUserList[1],
    lat: "41.2851",
    long: "69.2043",
    moreLong: ["41.2851", "69.2043"],
  },
];

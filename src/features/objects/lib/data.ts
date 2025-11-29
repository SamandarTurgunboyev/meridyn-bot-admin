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

export interface ObjectListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: ObjectListData[];
  };
}

export interface ObjectListData {
  id: number;
  name: string;
  district: {
    id: number;
    name: string;
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
  longitude: number;
  latitude: number;
  extra_location: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
}

export interface ObjectCreate {
  district_id: number;
  user_id: number;
  name: string;
  longitude: number;
  latitude: number;
  extra_location: { longitude: number; latitude: number };
}

export interface ObjectUpdate {
  name: string;
  longitude: number;
  latitude: number;
  extra_location: { longitude: number; latitude: number };
}

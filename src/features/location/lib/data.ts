import { fakeDistrict, type District } from "@/features/districts/lib/data";
import {
  doctorListData,
  type DoctorListType,
} from "@/features/doctors/lib/data";
import {
  ObjectListData,
  type ObjectListType,
} from "@/features/objects/lib/data";
import {
  PharmciesData,
  type PharmciesType,
} from "@/features/pharmacies/lib/data";
import { FakeUserList, type User } from "@/features/users/lib/data";

export interface LocationListType {
  id: number;
  user: User;
  object?: ObjectListType;
  district?: District;
  pharmcies?: PharmciesType;
  doctor?: DoctorListType;
  long: string;
  lat: string;
  createdAt: Date; // ⬅ qo‘shildi
}

export const LocationFakeData: LocationListType[] = [
  {
    id: 1,
    user: FakeUserList[0],
    object: ObjectListData[0],
    long: "69.2401",
    lat: "41.2995",
    createdAt: new Date("2025-02-01T10:15:00"),
  },
  {
    id: 2,
    user: FakeUserList[1],
    district: fakeDistrict[1],
    long: "69.2305",
    lat: "41.3102",
    createdAt: new Date("2025-02-03T14:22:00"),
  },
  {
    id: 3,
    user: FakeUserList[2],
    pharmcies: PharmciesData[0],
    long: "69.2450",
    lat: "41.3000",
    createdAt: new Date("2025-02-05T09:40:00"),
  },
  {
    id: 4,
    user: FakeUserList[0],
    doctor: doctorListData[2],
    long: "69.2250",
    lat: "41.3122",
    createdAt: new Date("2025-02-10T18:10:00"),
  },
  {
    id: 5,
    user: FakeUserList[3],
    object: ObjectListData[2],
    long: "69.2180",
    lat: "41.3055",
    createdAt: new Date("2025-02-12T11:55:00"),
  },
  {
    id: 6,
    user: FakeUserList[5],
    object: ObjectListData[1],
    long: "69.2043",
    lat: "41.2859",
    createdAt: new Date("2025-02-01T10:15:00"),
  },
];

export interface LocationListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: null | string;
    previous: null | string;
    results: LocationListDataRes[];
  };
}

export interface LocationListDataRes {
  id: number;
  longitude: number;
  latitude: number;
  created_at: string;
  district: {
    id: number;
    name: string;
  };
  place: {
    id: number;
    name: string;
    longitude: number;
    latitude: number;
  };
  doctor: {
    id: number;
    first_name: string;
    last_name: string;
    longitude: number;
    latitude: number;
  };
  pharmacy: {
    id: number;
    name: string;
    longitude: number;
    latitude: number;
  };
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  updated_at: string;
}

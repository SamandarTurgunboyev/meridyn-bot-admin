import { fakeDistrict, type District } from "@/features/districts/lib/data";
import {
  ObjectListData,
  type ObjectListType,
} from "@/features/objects/lib/data";
import { FakeUserList, type User } from "@/features/users/lib/data";

export interface DoctorListType {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  work: string;
  spec: string;
  desc: string;
  district: District;
  user: User;
  object: ObjectListType;
  long: string;
  lat: string;
}

export const doctorListData: DoctorListType[] = [
  {
    id: 1,
    first_name: "Ali",
    last_name: "Valiyev",
    phone_number: "+998901234567",
    work: "Toshkent Shifoxonasi",
    spec: "Kardiolog",
    desc: "Malakali kardiolog, 10 yillik tajribaga ega",
    district: fakeDistrict[0],
    user: FakeUserList[0],
    object: ObjectListData[0],
    lat: ObjectListData[0].lat,
    long: ObjectListData[0].long,
  },
  {
    id: 2,
    first_name: "Madina",
    last_name: "Karimova",
    phone_number: "+998901112233",
    work: "Yunusobod Poliklinikasi",
    spec: "Pediatr",
    desc: "Bolalar shifokori, 7 yillik ish tajribasi mavjud",
    district: fakeDistrict[1],
    user: FakeUserList[1],
    object: ObjectListData[1],
    lat: ObjectListData[1].lat,
    long: ObjectListData[1].long,
  },
];

export interface DoctorListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: string;
    previous: string;
    results: DoctorListResData[];
  };
}

export interface DoctorListResData {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  work_place: string;
  sphere: string;
  description: string;
  district: {
    id: number;
    name: string;
  };
  place: {
    id: number;
    name: string;
  };
  user: {
    id: number;
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

export interface CreateDoctorReq {
  first_name: string;
  last_name: string;
  phone_number: string;
  work_place: string;
  sphere: string;
  description: string;
  district_id: number;
  place_id: number;
  user_id: number;
  longitude: number;
  latitude: number;
  extra_location: {
    longitude: number;
    latitude: number;
  };
}
export interface UpdateDoctorReq {
  first_name: string;
  last_name: string;
  phone_number: string;
  work_place: string;
  sphere: string;
  description: string;
  longitude: number;
  latitude: number;
  extra_location: { longitude: number; latitude: number };
}

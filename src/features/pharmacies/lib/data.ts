import { fakeDistrict, type District } from "@/features/districts/lib/data";
import {
  ObjectListData,
  type ObjectListType,
} from "@/features/objects/lib/data";
import { FakeUserList, type User } from "@/features/users/lib/data";

export interface PharmciesType {
  id: number;
  name: string;
  inn: string;
  phone_number: string;
  additional_phone: string;
  district: District;
  user: User;
  object: ObjectListType;
  long: string;
  lat: string;
}

export const PharmciesData: PharmciesType[] = [
  {
    id: 1,
    name: "City Pharmacy",
    inn: "123456789",
    phone_number: "+998901234567",
    additional_phone: "+998901112233",
    district: fakeDistrict[0],
    user: FakeUserList[0],
    object: ObjectListData[0],
    long: "69.2401",
    lat: "41.2995",
  },
  {
    id: 2,
    name: "Central Pharmacy",
    inn: "987654321",
    phone_number: "+998902345678",
    additional_phone: "+998903334455",
    district: fakeDistrict[1],
    user: FakeUserList[1],
    object: ObjectListData[1],
    long: "69.2305",
    lat: "41.3102",
  },
  {
    id: 3,
    name: "Green Pharmacy",
    inn: "112233445",
    phone_number: "+998903456789",
    additional_phone: "+998904445566",
    district: fakeDistrict[2],
    user: FakeUserList[2],
    object: ObjectListData[1],
    long: "69.2208",
    lat: "41.305",
  },
  {
    id: 4,
    name: "HealthPlus Pharmacy",
    inn: "556677889",
    phone_number: "+998905678901",
    additional_phone: "+998906667788",
    district: fakeDistrict[0],
    user: FakeUserList[1],
    object: ObjectListData[1],
    long: "69.235",
    lat: "41.312",
  },
  {
    id: 5,
    name: "Optima Pharmacy",
    inn: "998877665",
    phone_number: "+998907890123",
    additional_phone: "+998908889900",
    district: fakeDistrict[1],
    user: FakeUserList[0],
    object: ObjectListData[0],
    long: "69.245",
    lat: "41.3",
  },
];

export interface PharmaciesListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: null | string;
    previous: null | string;
    results: PharmaciesListData[];
  };
}

export interface PharmaciesListData {
  id: number;
  name: string;
  inn: string;
  owner_phone: string;
  responsible_phone: string;
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

export interface CreatePharmaciesReq {
  name: string;
  inn: string;
  owner_phone: string;
  responsible_phone: string;
  district_id: number;
  place_id: number;
  user_id: number;
  longitude: number;
  latitude: number;
  extra_location: { longitude: number; latitude: number };
}

export interface UpdatePharmaciesReq {
  name: string;
  inn: string;
  owner_phone: string;
  responsible_phone: string;
  longitude: number;
  latitude: number;
  extra_location: { longitude: number; latitude: number };
}

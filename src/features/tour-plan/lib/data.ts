import { FakeUserList, type User } from "@/features/users/lib/data";

export interface UserLocation {
  long: string;
  lat: string;
}

export type TourStatus = "planned" | "completed";

export interface TourPlanType {
  id: number;
  district: string;
  user: User;
  userLocation?: UserLocation;
  date: Date;
  long: string;
  lat: string;
  status: TourStatus;
}

export const fakeTourPlan: TourPlanType[] = [
  {
    id: 1,
    district: "Urgut",
    user: FakeUserList[0],
    date: new Date("2025-12-01T09:00:00"),
    long: "69.2401",
    lat: "41.3111",
    status: "planned",
  },
  {
    id: 2,
    district: "Yunusobod",
    user: FakeUserList[1],
    userLocation: { long: "69.2310", lat: "41.3210" },
    date: new Date("2025-12-02T14:30:00"),
    long: "69.2300",
    lat: "41.3200",
    status: "completed",
  },
  {
    id: 3,
    district: "Bekobod",
    user: FakeUserList[2],
    date: new Date("2025-12-03T11:00:00"),
    long: "69.2500",
    lat: "41.3150",
    status: "completed",
  },
  {
    id: 4,
    district: "Yunusobod",
    user: FakeUserList[3],
    userLocation: { long: "69.2460", lat: "41.3110" },
    date: new Date("2025-12-04T16:00:00"),
    long: "69.2450",
    lat: "41.3100",
    status: "planned",
  },
];

export interface PlanTourListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: null | string;
    previous: null | string;
    results: PlanTourListDataRes[];
  };
}

export interface PlanTourListDataRes {
  id: number;
  place_name: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  latitude: null | string;
  longitude: null | string;
  location_send: boolean;
  date: null | string;
  created_at: string;
}

export interface PlanTourCreate {
  place_name: string;
  // latitude: number;
  // longitude: number;
  user_id: number;
  date: string;
}

export interface PlanTourUpdate {
  place_name: string;
  user: number;
  // latitude: number;
  // longitude: number;
  date: string;
}

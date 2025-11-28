export interface RegionType {
  id: number;
  name: string;
}

export const fakeRegionList: RegionType[] = [
  {
    id: 1,
    name: "Toshkent",
  },
  {
    id: 2,
    name: "Samarqand",
  },
  {
    id: 1,
    name: "Andijon",
  },
];

export interface RegionListRes {
  status_code: number;
  status: string;
  message: string;
  data: RegionListResData[];
}

export interface RegionListResData {
  id: number;
  name: string;
  created_at: string;
}

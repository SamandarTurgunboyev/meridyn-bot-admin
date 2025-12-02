export interface ReportsTypeList {
  id: number;
  pharm_name: string;
  amount: string;
  month: Date;
}

export const ReportsData: ReportsTypeList[] = [
  {
    id: 1,
    pharm_name: "City Pharmacy",
    amount: "500000",
    month: new Date(2025, 0, 1),
  },
  {
    id: 2,
    pharm_name: "Central Pharmacy",
    amount: "750000",
    month: new Date(2025, 0, 1),
  },
  {
    id: 3,
    pharm_name: "Green Pharmacy",
    amount: "620000",
    month: new Date(2025, 1, 1),
  },
  {
    id: 4,
    pharm_name: "HealthPlus Pharmacy",
    amount: "810000",
    month: new Date(2025, 1, 1),
  },
  {
    id: 5,
    pharm_name: "Optima Pharmacy",
    amount: "430000",
    month: new Date(2025, 2, 1),
  },
  {
    id: 6,
    pharm_name: "City Pharmacy",
    amount: "540000",
    month: new Date(2025, 2, 1),
  },
  {
    id: 7,
    pharm_name: "Central Pharmacy",
    amount: "770000",
    month: new Date(2025, 3, 1),
  },
  {
    id: 8,
    pharm_name: "Green Pharmacy",
    amount: "650000",
    month: new Date(2025, 3, 1),
  },
  {
    id: 9,
    pharm_name: "HealthPlus Pharmacy",
    amount: "820000",
    month: new Date(2025, 4, 1),
  },
  {
    id: 10,
    pharm_name: "Optima Pharmacy",
    amount: "460000",
    month: new Date(2025, 4, 1),
  },
];

export interface ResportListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: null | string;
    previous: null | string;
    results: ResportListResData[];
  };
}

export interface ResportListResData {
  id: number;
  employee_name: string;
  factory: {
    id: number;
    name: string;
  };
  price: string;
  created_at: string;
}

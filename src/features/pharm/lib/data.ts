export interface PharmType {
  id: number;
  name: string;
}

export const pharmData: PharmType[] = [
  {
    id: 1,
    name: "Meridyn",
  },
];

export interface FactoryListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: null | string;
    previous: null | string;
    results: FactoryListDataRes[];
  };
}

export interface FactoryListDataRes {
  id: number;
  name: string;
  created_at: string;
}

export interface FactoryCreate {
  name: string;
}

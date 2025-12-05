export interface DistributedList {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: null | string;
    previous: null | string;
    results: DistributedListData[];
  };
}

export interface DistributedListData {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  employee_name: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  date: string;
}

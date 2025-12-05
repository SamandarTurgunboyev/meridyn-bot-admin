export interface SupportListRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    count: number;
    next: null | string;
    previous: null | string;
    results: SupportListData[];
  };
}
export interface SupportListData {
  id: number;
  problem: string;
  date: string;
  type: "PROBLEM" | "HELP";
  district: {
    id: number;
    name: string;
  } | null;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

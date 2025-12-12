export interface GetMeRes {
  status: string;
  status_code: number;
  data: GetMeResData;
}

export interface GetMeResData {
  created_at: string;
  first_name: string;
  id: number;
  is_active: boolean;
  is_superuser: boolean;
  last_name: string;
  region: null | number;
  telegram_id: null | number;
}

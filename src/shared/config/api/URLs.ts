const API_V = "/api/v1/";

export const API_URLS = {
  BASE_URL: import.meta.env.VITE_API_URL || "https://api.meridynpharma.com",
  LOGIN: `${API_V}authentication/admin_login/`,
  USER: `${API_V}admin/user/`,
  REGION: `${API_V}admin/district/`,
  REGIONS: `${API_V}admin/region/`,
  DISTRICT: `${API_V}admin/district/`,
  DOCTOR: `${API_V}admin/doctor/`,
  OBJECT: `${API_V}admin/place/`,
  PHARMACIES: `${API_V}admin/pharmacy/`,
  PLANS: `${API_V}admin/plan/`,
  PILL: `${API_V}admin/product/`,
  LOCATION: `${API_V}admin/location/`,
  USER_LOCATION: `${API_V}admin/user_location/`,
  ORDER: `${API_V}admin/order/`,
  FACTORY: `${API_V}admin/factory/`,
  REPORT: `${API_V}admin/payment/`,
  TOUR_PLAN: `${API_V}admin/tour_plan/`,
  SUPPORT: `${API_V}admin/support/list/`,
  DISTRIBUTED: `${API_V}admin/distributed_product/list/`,
};

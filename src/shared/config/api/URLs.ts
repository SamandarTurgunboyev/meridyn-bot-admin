const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.meridynpharma.com";

const LOGIN = "/api/v1/authentication/admin_login/";
const USER = "/api/v1/admin/user/";
const REGION = "/api/v1/admin/district/";
const REGIONS = "/api/v1/admin/region/";
const DISTRICT = "/api/v1/admin/district/";
const DOCTOR = "/api/v1/admin/doctor/";
const OBJECT = "/api/v1/admin/place/";
const PHARMACIES = "/api/v1/admin/pharmacy/";

export {
  BASE_URL,
  DISTRICT,
  DOCTOR,
  LOGIN,
  OBJECT,
  PHARMACIES,
  REGION,
  REGIONS,
  USER,
};

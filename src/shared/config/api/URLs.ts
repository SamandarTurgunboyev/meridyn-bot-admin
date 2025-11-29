const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.meridynpharma.com";

const LOGIN = "/api/v1/authentication/admin_login/";
const USER = "/api/v1/admin/user/";
const REGION = "/api/v1/admin/district/";
const REGIONS = "/api/v1/admin/region/";
const DISTRICT = "/api/v1/admin/district/";
const DOCTOR = "/api/v1/admin/doctor/";

export { BASE_URL, DISTRICT, DOCTOR, LOGIN, REGION, REGIONS, USER };

import cookie from "js-cookie";

const token = "access_meridyn_admin";

export const saveToken = (value: string) => {
  cookie.set(token, value);
};

export const getToken = () => {
  return cookie.get(token);
};

export const removeToken = () => {
  cookie.remove(token);
};

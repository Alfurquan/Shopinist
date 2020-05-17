import jwtDecode from "jwt-decode";

export default getCurrentUser = token => {
  try {
    return jwtDecode(token);
  } catch (ex) {
    return null;
  }
};

import { apiUrl } from "../../config/config.json";
import { AsyncStorage } from "react-native";
import getCurrentUser from "./../../services/UserService";

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

export const authenticate = (token, userId) => {
  return { type: AUTHENTICATE, token: token, userId: userId };
};

export const logout = () => {
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

export const signUp = (name, email, password) => {
  let user, token;
  return async dispatch => {
    try {
      const response = await fetch(apiUrl + "/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      token = response.headers.get("x-auth-token");

      const resData = await response.json();
      user = resData._id;
    } catch (ex) {
      console.log("Error is", ex);
    }
    dispatch(authenticate(token, user));
    saveDataToStorage(token, user);
  };
};

export const login = (email, password) => {
  let user, token;
  return async dispatch => {
    try {
      const response = await fetch(apiUrl + "/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      if (!response.ok) {
        let message = "Something went wrong!";
        if (response.status === 400) {
          message = "Invalid email or password";
        }
        throw new Error(message);
      }

      const resData = await response.json();
      token = resData.token;
      user = getCurrentUser(token);
      // console.log("current user", user._id);
    } catch (ex) {
      throw ex;
    }
    dispatch(authenticate(token, user._id));
    saveDataToStorage(token, user._id);
  };
};

const saveDataToStorage = (token, userId) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId
    })
  );
};

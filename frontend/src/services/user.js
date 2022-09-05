import axios from "axios";
import { errorNotification } from "../services/messages";

// Function to get the user token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Function to set the user token to localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Function to delete the user token from localStorage
export const deleteToken = () => {
  localStorage.removeItem("token");
};

// Function to get the user location from localStorage. Used when user is an "externalUser"
export const getLocation = () => {
  return JSON.parse(localStorage.getItem("location"));
};

// Function to set the user location to localStorage. Used when user is an "externalUser"
export const setLocation = (location) => {
  localStorage.setItem("location", JSON.stringify(location));
};

// Function to delete the user location from localStorage. Used when user is an "externalUser"
export const deleteLocation = () => {
  localStorage.removeItem("location");
};

// Function to check if the user is an "externalUser"
export const isAnExternalUser = () => {
  if (getToken() === "externalUser") return true;
  return false;
};

// Function to get the user from database when user is logged
export const getUserFromDb = async () => {
  if (!isAnExternalUser()) {
    try {
      const { data } = await axios.get(`/login/getUser/${getToken()}`);
      return data;
    } catch (error) {
      errorNotification();
    }
  }
};

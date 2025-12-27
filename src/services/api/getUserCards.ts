import axios from "axios";
import { getAuthToken } from "../config";

export const getUserCards = async () => {
  const authToken = await getAuthToken();
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log('User cards API URL:', `${apiUrl}/api/card/user/cards`);
  
  const response = await axios.get(`${apiUrl}/api/card/user/cards`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
};
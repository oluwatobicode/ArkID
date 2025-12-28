import axios from "axios";
import { getAuthToken } from "../config";

export const activateCard = async (cardId: string, redirectUrl: string) => {
  const authToken = await getAuthToken();
  const apiUrl = import.meta.env.VITE_API_URL;
  // console.log('Activate API URL:', `${apiUrl}/api/card/activate`);
  
  const response = await axios.post(`${apiUrl}/api/card/activate`, {
    card_id: cardId,
    redirect_url: redirectUrl,
  }, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
};

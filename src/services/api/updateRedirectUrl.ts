import axios from "axios";
import { getAuthToken } from "../config";

export const updateRedirectUrl = async (redirectUrl: string) => {
  const authToken = await getAuthToken();
  
  // Use proxy in development, full URL in production
  const isDevelopment = import.meta.env.DEV;
  const fullUrl = isDevelopment 
    ? '/api/card/update' 
    : `${import.meta.env.VITE_API_URL}/api/card/update`;
  
  console.log('Update redirect API URL:', fullUrl);
  console.log('Environment:', { isDevelopment, VITE_API_URL: import.meta.env.VITE_API_URL });
  
  const response = await axios.patch(fullUrl, {
    redirect_url: redirectUrl,
  }, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
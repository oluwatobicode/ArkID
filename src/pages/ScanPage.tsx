import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { getCard } from "../services/api/getCard";
import Preloader from "../components/Preloader";

interface CardData {
  username: string;
  isActivated: boolean;
  redirect_url: string | null;
  taps_count: number;
}

interface ApiResponse {
  success: boolean;
  data: CardData;
}

const ScanPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { authenticated, ready } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug environment variables
  console.log('ScanPage - Environment check:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID,
    username: username
  });

  useEffect(() => {
    const checkCard = async () => {
      if (!username) {
        navigate("/");
        return;
      }

      try {
        console.log('Checking card for username:', username);
        const response: ApiResponse = await getCard(username);
        console.log('Card API response:', response);
        
        if (response.success) {
          const data = response.data;
          
          // Navigate to dashboard with the card data
          // User can view and update redirect link from dashboard
          if (authenticated) {
            navigate("/dashboard", { state: { scannedCardData: data } });
          } else {
            // If not authenticated, prompt to login first
            navigate("/not-activated", { state: { cardData: data, needsAuth: true } });
          }
        } else {
          // Handle card not found - show not-activated page with username
          console.log('Card not found, redirecting to not-activated page');
          const cardData = {
            username: username,
            isActivated: false,
            redirect_url: null,
            taps_count: 0
          };
          navigate("/not-activated", { 
            state: { 
              cardData: cardData, 
              needsAuth: !authenticated,
              cardNotFound: true 
            } 
          });
        }
      } catch (err) {
        console.error("Error checking card:", err);
        
        // Better error handling
        let errorMessage = "Failed to load card data";
        
        if (err && typeof err === 'object') {
          if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response) {
            // Axios error with response
            const axiosError = err as { response: { data?: { message?: string }; status: number } };
            errorMessage = axiosError.response.data?.message || 
                          `Server error: ${axiosError.response.status}`;
          } else if ('message' in err && typeof (err as { message?: unknown }).message === 'string') {
            // Standard Error object
            errorMessage = `Error: ${(err as { message: string }).message}`;
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (ready) {
      checkCard();
    }
  }, [username, navigate, authenticated, ready]);

  if (loading || !ready) {
    return <Preloader onComplete={() => {}} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default ScanPage;
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import RedirectSection from "../components/RedirectSection";
import StatCard from "../components/StatCard";
import { getUserCards } from "../services/api/getUserCards";

interface UserCard {
  card_id: string;
  user_id: string;
  username: string;
  email: string;
  isActivated: boolean;
  redirect_url: string | null;
  taps_count: number;
  valid_redirects_count: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: UserCard[];
}

const Dashboard = () => {
  const { authenticated, ready, logout, user } = usePrivy();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated && ready) {
      navigate("/");
      return;
    }

    const fetchUserCards = async () => {
      if (!authenticated) return;
      
      try {
        const response: ApiResponse = await getUserCards();
        if (response.success) {
          setUserCards(response.data);
        } else {
          setError("Failed to load cards");
        }
      } catch (err) {
        console.error("Error fetching user cards:", err);
        setError("Failed to load cards");
      } finally {
        setLoading(false);
      }
    };

    if (authenticated) {
      fetchUserCards();
    }
  }, [authenticated, ready, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentCard = userCards[0]; // Assuming user has one card

  if (!ready || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <img src="/Logo (2).png" alt="Loading..." className="animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#d4af37] text-black rounded hover:bg-[#c29f2f]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 text-white hover:bg-gray-800 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sliding Menu */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop with blur */}
        <div 
          className={`absolute inset-0 backdrop-blur-sm bg-black/50 transition-all duration-300`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-80 bg-[#1a1a1a] shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-gray-700 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo */}
            <div className="mb-8 mt-4">
              <img src="/Logo (2).png" alt="ArkID Logo" className="h-8 w-auto" />
            </div>

            {/* User Info */}
            <div className="mb-8 pb-6 border-b border-gray-700">
              <p className="text-white text-lg font-semibold">
                {user?.email?.address || "User"}
              </p>
              <p className="text-gray-400 text-sm">
                {currentCard?.username ? `@${currentCard.username}` : "No cards"}
              </p>
            </div>

            {/* Menu Items */}
            <nav className="space-y-4">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // Navigate to dashboard (already here)
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/activate");
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Activate New Card
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header with gradient background and profile */}
        <div className="relative">
          {/* Gradient Header Background */}
          <div className="h-48 md:h-64 w-full overflow-hidden rounded-b-[24px] md:rounded-b-[32px]">
            <img 
              src="/header-gradient.svg" 
              alt="Header Background" 
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Profile Picture - Overlays the header */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 md:-bottom-20">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#D4AF37] overflow-hidden bg-gray-200">
                <img 
                  src="/profile-placeholder.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentCard?.username || "User")}&size=200&background=D4AF37&color=000`;
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Username and Status */}
        <div className="mt-20 md:mt-24 px-3 md:px-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            @{currentCard?.username || "No username"}
          </h1>
          <div className={`inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${
            currentCard?.isActivated 
              ? "bg-[#B4FFE6] text-[#10B981]" 
              : "bg-[#FEE2E2] text-[#EF4444]"
          }`}>
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${
              currentCard?.isActivated ? "bg-[#10B981]" : "bg-[#EF4444]"
            }`}></span>
            {currentCard?.isActivated ? "Active" : "Inactive"}
          </div>
        </div>

        {/* Stats and Content */}
        <div className="mt-8 px-3 md:px-6 space-y-6 pb-8">
          <div className="flex flex-row gap-4">
            <StatCard 
              icon="/tap-one.svg" 
              label="TOTAL TAPS" 
              value={currentCard?.taps_count?.toString() || "0"} 
            />
            <StatCard
              icon="/tick-one.svg"
              label="VALID REDIRECTS"
              value={currentCard?.valid_redirects_count?.toString() || "0"}
            />
          </div>

          <div className="rounded-[8px] bg-[#202022] p-6 md:p-8">
            <RedirectSection currentUrl={currentCard?.redirect_url} />
            <ProfileForm userCard={currentCard} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

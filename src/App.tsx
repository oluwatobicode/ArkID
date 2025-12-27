import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentCallback from "./pages/PaymentCallback";
import CardActivate from "./pages/CardActiviate";
import CardNotActivatedPage from "./pages/CardNotActivated";
import Dashboard from "./pages/Dashboard";
import ScanPage from "./pages/ScanPage";
import Preloader from "./components/Preloader";
import { PrivyProvider } from "@privy-io/react-auth";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <PrivyProvider 
    appId={import.meta.env.VITE_PRIVY_APP_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/activate" element={<CardActivate />} />
          <Route path="/not-activated" element={<CardNotActivatedPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan/:username" element={<ScanPage />} />
        </Routes>
      </BrowserRouter>
    </PrivyProvider>
  );
}

export default App;

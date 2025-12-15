import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import CardActivate from "./pages/CardActiviate";
import Dashboard from "./pages/Dashboard";
import Preloader from "./components/Preloader";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardActivate />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

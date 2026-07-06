import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import Login from "./pages/Login";
import { ThemeProvider } from "./context/ThemeContext";
import { SeverityProvider } from "./context/SeverityContext";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("tgiccc_auth") === "true";
  });

  const handleLogin = () => {
    localStorage.setItem("tgiccc_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("tgiccc_auth");
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <SeverityProvider>
        <BrowserRouter>
          <ScrollToTop />
          {isAuthenticated ? (
            <MainLayout onLogout={handleLogout}>
              <AppRoutes onLogout={handleLogout} />
            </MainLayout>
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </BrowserRouter>
      </SeverityProvider>
    </ThemeProvider>
  );
}

export default App;
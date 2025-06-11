import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from "./pages/LoginPage";
import Dashboard from "./NovasTelas/dashboard/DashboardT";  // certifique-se do caminho
import { SideBar } from "./NovasTelas/SideBar"; // certifique-se do caminho correto

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rotas privadas */}
          
<Route path="/dashboard" element={
  <PrivateRoute>
    <SideBar />
  </PrivateRoute>
} />

         

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

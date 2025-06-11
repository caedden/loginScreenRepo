import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { getTokens } from '../utils/tokenStorage';
import { authService } from '../services/authService';

const WelcomeScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('usuário');
  const [expiration, setExpiration] = useState<string>('Desconhecida');
  const navigate = useNavigate();

  useEffect(() => {
    const tokens = getTokens();

    if (!tokens || !tokens.accessToken) {
      navigate('/login');
      return;
    }

    const emailFromStorage = localStorage.getItem('user_email');
    const expiresAt = new Date(tokens.expiresAt);

    setEmail(emailFromStorage || 'usuário');
    setExpiration(
      expiresAt.toLocaleString('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    );
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleGoToDashboard = () => navigate('/dashboard');

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card shadow-lg text-center p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="d-flex justify-content-center mb-3">
          <CheckCircle size={64} className="text-success" />
        </div>
        <h1 className="display-5 fw-bold mb-3">Seja bem-vindo(a), <span className="text-primary">{email}</span>!</h1>
        <p className="lead mb-4">
          Seu token expira em:
          <br />
          <span className="fw-semibold text-secondary">{expiration}</span>
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button onClick={handleGoToDashboard} className="btn btn-primary px-4 py-2 fw-semibold">
            Ir para Dashboard
          </button>
          <button onClick={handleLogout} className="btn btn-outline-danger px-4 py-2 fw-semibold">
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

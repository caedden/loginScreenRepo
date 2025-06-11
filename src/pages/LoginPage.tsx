import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, tokenExpiresAt } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/WelcomePage');

      if (tokenExpiresAt) {
        const now = Date.now();
        const msLeft = tokenExpiresAt - now;
        if (msLeft > 0) {
          const minutesLeft = Math.floor(msLeft / 60000);
          const secondsLeft = Math.floor((msLeft % 60000) / 1000);
          alert(`Seu token expira em ${minutesLeft} minuto(s) e ${secondsLeft} segundo(s).`);
        }
      }
    }
  }, [isAuthenticated, navigate, tokenExpiresAt]);

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="card shadow-sm" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-4">
          <h3 className="card-title mb-3 text-center">
            {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
          </h3>
          <p className="text-center text-muted mb-4">
            {isLogin
              ? 'Digite suas credenciais para entrar no Seraphine Connect'
              : 'Preencha os dados para começar a usar o Seraphine Connect'}
          </p>

          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => setIsLogin(true)} />
          )}

          <div className="text-center mt-4">
            <small className="text-muted">
              {isLogin ? 'Ainda não tem uma conta? ' : 'Já tem uma conta? '}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Cadastre-se' : 'Entrar'}
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

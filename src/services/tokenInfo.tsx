import React, { useEffect, useState } from 'react';
import { getTokens } from '../utils/tokenStorage';

const TokenInfo: React.FC = () => {
  const [token, setToken] = useState<string>('Token não encontrado');
  const [timeLeft, setTimeLeft] = useState<string>('Carregando...');

  useEffect(() => {
    const tokens = getTokens();

    if (!tokens || !tokens.accessToken) {
      setToken('Token não encontrado');
      setTimeLeft('Expiração não disponível');
      return;
    }

    setToken(tokens.accessToken);

    const expiresAt = new Date(tokens.expiresAt).getTime();

    const updateTimeLeft = () => {
      const now = Date.now();
      const msLeft = expiresAt - now;

      if (msLeft <= 0) {
        setTimeLeft('Token expirado');
        return;
      }

      const minutes = Math.floor(msLeft / 60000);
      const seconds = Math.floor((msLeft % 60000) / 1000);
      setTimeLeft(`${minutes} minuto(s) e ${seconds} segundo(s) restantes`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Informações do Token</h1>
      <p><strong>Token:</strong> <code className="break-all">{token}</code></p>
      <p className="mt-2"><strong>Tempo para expirar:</strong> {timeLeft}</p>
    </div>
  );
};

export default TokenInfo;

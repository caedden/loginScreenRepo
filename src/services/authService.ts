import axios from 'axios';
import { AuthTokens, LoginCredentials } from '../types/auth';
import { setTokens, removeTokens } from '../utils/tokenStorage';

const BASE_URL = 'https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com/Autenticacao';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
  try {
    const response = await axios.post(`${BASE_URL}/autenticar`, {
      email: credentials.email,
      senha: credentials.password,
    });

    const tokens: AuthTokens = {
      accessToken: response.data.token,
      expiresAt: response.data.dataExpiracao, 
     
    };
    localStorage.setItem('user_email', credentials.email);

    setTokens(tokens); 

    return tokens;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Credenciais inválidas');
    }
    throw new Error('Erro ao tentar fazer login. Tente novamente.');
  }
}
,

  async register(data: { email: string; senha: string; senhaConfirmada: string }) {
    try {
      const response = await axios.post(`${BASE_URL}/registar`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data || 'Erro ao registrar usuário');
      }
      throw new Error('Erro ao tentar registrar usuário. Tente novamente.');
    }
  },

  async logout(): Promise<void> {
    
    removeTokens();
    window.location.href = '/login';
  },
};

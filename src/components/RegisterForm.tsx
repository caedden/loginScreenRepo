import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, UserRound } from 'lucide-react';
import { CompleteProfileForm } from '../components/CompleteProfileForm';

const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Por favor, insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState<RegisterFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegistration = async (data: RegisterFormValues) => {
    setUserData(data);
  };

  if (userData) {
    return (
      <CompleteProfileForm
        baseData={userData}
        onComplete={() => {
          alert('Cadastro completo com sucesso!');
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome completo</label>
        <div className="relative">
          <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            {...register('name')}
            className={`pl-10 w-full rounded-lg border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="João Silva"
          />
        </div>
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            {...register('email')}
            className={`pl-10 w-full rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="email@exemplo.com"
          />
        </div>
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`pl-10 w-full rounded-lg border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Confirmar Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmar senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className={`pl-10 w-full rounded-lg border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        Continuar
      </button>
    </form>
  );
};

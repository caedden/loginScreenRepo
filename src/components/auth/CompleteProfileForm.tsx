import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRound, Phone, MapPin } from 'lucide-react';

const profileSchema = z.object({
  document: z.string().min(5, 'Documento obrigatório'),
  phone: z.string().min(8, 'Telefone obrigatório'),
  address: z.string().min(5, 'Endereço obrigatório'),
});

export type ProfileData = z.infer<typeof profileSchema>;

interface CompleteProfileFormProps {
  baseData: {
    name: string;
    email: string;
    password: string;
  };
  onComplete: (data: ProfileData) => void;
}

export const CompleteProfileForm = ({ baseData, onComplete }: CompleteProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileData) => {
    try {
      await onComplete(data);
    } catch (error) {
      console.error('Erro ao completar perfil:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Documento (CPF/CNPJ)</label>
        <div className="relative">
          <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            {...register('document')}
            className={`pl-10 w-full rounded-lg border ${
              errors.document ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="000.000.000-00"
          />
        </div>
        {errors.document && <p className="text-red-600 text-xs mt-1">{errors.document.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Telefone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="tel"
            {...register('phone')}
            className={`pl-10 w-full rounded-lg border ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="(00) 00000-0000"
          />
        </div>
        {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Endereço</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            {...register('address')}
            className={`pl-10 w-full rounded-lg border ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Rua, número, complemento"
          />
        </div>
        {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-indigo-600 text-white p-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Finalizando...' : 'Finalizar cadastro'}
      </button>
    </form>
  );
};
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  document: z.string().min(5, 'Documento obrigatório'),
  phone: z.string().min(8, 'Telefone obrigatório'),
  address: z.string().min(5, 'Endereço obrigatório'),
});

export type ProfileData = z.infer<typeof profileSchema>;

interface CompleteProfileFormProps {
  onComplete: (data: ProfileData) => void;
}

export const CompleteProfileForm = ({ onComplete }: CompleteProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileData) => {
    onComplete(data); // entrega os dados para o componente pai
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-8">
      <h2 className="text-lg font-semibold text-gray-800">Complete seu perfil</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Documento</label>
        <input {...register('document')} className="w-full p-2 border rounded" />
        {errors.document && <p className="text-red-600 text-xs">{errors.document.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Telefone</label>
        <input {...register('phone')} className="w-full p-2 border rounded" />
        {errors.phone && <p className="text-red-600 text-xs">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Endereço</label>
        <input {...register('address')} className="w-full p-2 border rounded" />
        {errors.address && <p className="text-red-600 text-xs">{errors.address.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Continuar
      </button>
    </form>
  );
};

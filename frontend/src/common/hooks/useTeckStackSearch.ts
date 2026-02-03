import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  searchTeckStackSchema,
  type SearchTeckStack,
} from '@/common/schemas/searchTeckStackSchema';

export function useTeckStackSearch() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchTeckStack>({
    resolver: zodResolver(searchTeckStackSchema),
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  });

  return {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    errors,
  };
}

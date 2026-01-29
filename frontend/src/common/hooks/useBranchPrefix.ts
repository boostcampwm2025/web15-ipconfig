import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  branchPrefixSchema,
  type BranchPrefix,
} from '@/common/schemas/branchPrefixSchema';

export function useBranchPrefix() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BranchPrefix>({
    resolver: zodResolver(branchPrefixSchema),
    mode: 'onChange',
    defaultValues: {
      prefix: '',
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

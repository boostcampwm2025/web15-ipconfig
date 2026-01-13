import { useState } from 'react';
import { parseSubject } from '@/features/widgets/techStack/utils/parsing';

export function useSubject() {
  const [selectedSubject, setSelectedSubject] = useState('');

  const parsedSubject = parseSubject(selectedSubject);

  return { selectedSubject, setSelectedSubject, parsedSubject };
}

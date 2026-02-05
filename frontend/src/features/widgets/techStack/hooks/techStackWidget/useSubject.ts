import { useState } from 'react';

export function useSubject() {
  const [selectedSubject, setSelectedSubject] = useState('');

  return { selectedSubject, setSelectedSubject };
}

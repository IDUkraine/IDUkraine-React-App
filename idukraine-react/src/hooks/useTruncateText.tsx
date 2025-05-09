import { useCallback } from 'react';

export const useTruncateText = () => {
  const truncateText = useCallback(
    (text: string, maxWords: number = 20): string => {
      const words = text.split(' ');
      if (words.length <= maxWords) return text;
      return words.slice(0, maxWords).join(' ') + '...';
    },
    []
  );

  return { truncateText };
};

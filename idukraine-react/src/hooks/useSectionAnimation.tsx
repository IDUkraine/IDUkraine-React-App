import { useEffect, useState, useRef } from 'react';

export function useSectionAnimation(): [
  React.RefObject<HTMLDivElement | null>,
  boolean
] {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          if (ref.current) {
            observer.unobserve(ref.current); // Зупиняємо спостереження після анімації
          }
        }
      },
      {
        threshold: 0.1, // Зменшуємо поріг до 10% видимості
        rootMargin: '100px', // Додаємо 100px знизу, щоб анімація починалася раніше
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []); // Порожній масив залежностей

  return [ref, hasAnimated];
}

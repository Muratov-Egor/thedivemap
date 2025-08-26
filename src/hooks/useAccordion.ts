import { useState, useRef, useEffect } from 'react';

export function useAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Закрытие аккордеона при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    accordionRef,
    toggle,
    close,
  };
}

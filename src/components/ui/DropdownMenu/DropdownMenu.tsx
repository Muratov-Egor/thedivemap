import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '../icons';
import Button from '../Button';
import { cn } from '@/lib/utils';

export interface DropdownMenuItem {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  className?: string;
  align?: 'left' | 'right';
}

export default function DropdownMenu({ 
  trigger, 
  items, 
  className = '', 
  align = 'left' 
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownMenuItem) => {
    item.onClick();
    setIsOpen(false);
  };

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0'
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={cn(
            'absolute top-full mt-2 z-50 min-w-48 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg backdrop-blur-sm',
            alignmentClasses[align]
          )}
        >
          <div className="py-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'w-full px-4 py-3 text-left text-sm font-medium transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  item.variant === 'danger' 
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500/50' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500/50'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

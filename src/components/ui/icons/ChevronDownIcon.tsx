import { ChevronUpIcon } from './ChevronUpIcon';

export function ChevronDownIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <ChevronUpIcon 
      className={`transform rotate-180 ${className}`} 
      {...props} 
    />
  );
}

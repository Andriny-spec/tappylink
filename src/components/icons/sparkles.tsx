import React from 'react';

interface SparklesProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Sparkles: React.FC<SparklesProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3v4m3-3-2 2m-2-2-2 2" />
      <path d="M18 8c.9 0 1.6.7 2 1.5-.4.8-1.1 1.5-2 1.5a3 3 0 0 0 0-3Z" />
      <path d="M12 12v9" />
      <path d="M8 17s2 2 4 2 4-2 4-2" />
      <path d="M6 8c-.9 0-1.6.7-2 1.5.4.8 1.1 1.5 2 1.5a3 3 0 0 0 0-3Z" />
    </svg>
  );
};

export default Sparkles;

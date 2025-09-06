interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin ${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}></div>
    </div>
  );
}

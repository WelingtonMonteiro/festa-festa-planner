
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface FestanaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  onClick?: () => void;
  className?: string;
}

const FestanaLogo = ({ 
  size = 'md', 
  showTagline = false,
  onClick,
  className
}: FestanaLogoProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };
  
  const taglineSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Button 
        variant="logo" 
        onClick={handleClick}
        className="p-0 h-auto flex items-center gap-2"
      >
        <div className="relative">
          <div className="flex items-center">
            <span 
              className={`font-bold bg-gradient-to-r from-festa-primary via-festa-secondary to-festa-accent text-transparent bg-clip-text ${sizeClasses[size]}`}
            >
              Festana
            </span>
            <Sparkles className="ml-1 text-festa-accent" />
          </div>
          <div className={`absolute -top-1 -left-1 w-10 h-10 rounded-full bg-gradient-to-br from-festa-primary to-festa-accent opacity-20 blur-md`} />
        </div>
      </Button>
      {showTagline && (
        <p className={`text-muted-foreground mt-1 ${taglineSize[size]}`}>
          Gerenciamento de eventos simplificado
        </p>
      )}
    </div>
  );
};

export default FestanaLogo;

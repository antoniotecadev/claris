import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  isActive?: boolean;
  loading?: boolean;
  variant?: "outline" | "solid" | "danger" | "ghost";
}

export function IconButton({ 
  icon, 
  isActive, 
  loading,
  variant = "outline",
  className = "",
  ...props 
}: IconButtonProps) {
  const baseClasses = "flex items-center justify-center rounded-full transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";
  
  // Default sizes can be overridden via className. If className has 'w-' or 'h-', we don't apply 'w-9 h-9'
  const sizeClasses = className.includes('w-') || className.includes('h-') ? "" : "w-9 h-9";
  
  const variants = {
    outline: isActive 
      ? "bg-brand-primary border border-brand-primary text-white" 
      : "bg-white border border-slate-200 text-slate-500 hover:border-brand-primary hover:text-brand-primary",
    solid: "bg-brand-primary text-white hover:bg-blue-900 disabled:bg-slate-300",
    danger: "border border-red-100 text-red-600 hover:border-red-300 hover:bg-red-50",
    ghost: "text-slate-500 hover:text-brand-primary"
  };

  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variants[variant]} ${className}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
    </button>
  );
}

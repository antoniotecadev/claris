import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface BadgeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "danger";
}

export function BadgeButton({ 
  children, 
  icon, 
  loading, 
  loadingText = "...", 
  variant = "primary",
  className = "dark:bg-slate-300 dark:border-slate-800 ",
  ...props 
}: BadgeButtonProps) {
  const baseClasses = "flex h-7 items-center gap-1 rounded-full px-2.5 text-[10px] font-semibold shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    primary: "border border-slate-200 bg-white text-brand-primary hover:border-brand-primary hover:bg-brand-light",
    danger: "border border-red-100 bg-white text-red-600 hover:border-red-300 hover:bg-red-50",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={10} className="animate-spin" /> : icon}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
}

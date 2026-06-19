import { Search, X } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, className = "", containerClassName = "", ...props }, ref) => {
    const hasValue = Boolean(value);

    return (
      <div className={`relative ${containerClassName}`}>
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          className={`h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-[13px] text-stone-700 outline-none transition-colors duration-200 placeholder:text-stone-400 focus:border-brand-primary ${className}`}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X size={13} />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

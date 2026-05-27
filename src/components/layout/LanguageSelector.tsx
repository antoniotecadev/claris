"use client";

import { useState, useRef, useEffect } from "react";

const languages = [
	{ code: "pt", label: "Português", flag: "🇦🇴", short: "PT" },
	{ code: "en", label: "English", flag: "🇬🇧", short: "EN" },
	{ code: "fr", label: "Frances", flag: "🇫🇷", short: "FR" },
];

interface LanguageSelectorProps {
	currentLocale?: string;
	onLocaleChange?: (locale: string) => void;
}

export default function LanguageSelector({
	currentLocale = "pt",
	onLocaleChange,
}: LanguageSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(
		languages.find((l) => l.code === currentLocale) || languages[0]
	);
	const ref = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Close on Escape
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, []);

	const handleSelect = (lang: (typeof languages)[0]) => {
		setSelected(lang);
		setIsOpen(false);
		onLocaleChange?.(lang.code);
	};

	return (
		<div ref={ref} className="relative inline-block">
			{/* Trigger button */}
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-label="Selecionar idioma"
				className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium
          border transition-all duration-150 cursor-pointer whitespace-nowrap
          border-black/10 hover:border-black/20 hover:bg-black/5
          dark:border-white/15 dark:hover:border-white/25 dark:hover:bg-white/8
          ${isOpen
						? "bg-black/5 border-black/20 dark:bg-white/8 dark:border-white/25"
						: "bg-transparent"
					}
        `}
			>
				<span className="text-base leading-none">{selected.flag}</span>
				<span className="text-[13px] font-semibold tracking-wide">{selected.short}</span>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={`opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
				>
					<path
						d="M2 4L6 8L10 4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{/* Dropdown */}
			{isOpen && (
				<ul
					role="listbox"
					aria-label="Idiomas disponíveis"
					className="
            absolute top-[calc(100%+6px)] right-0 z-50
            min-w-40 p-1 m-0 list-none
            bg-white dark:bg-[#1c1c1e]
            border border-black/10 dark:border-white/10
            rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]
            dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
            animate-in fade-in slide-in-from-top-1 duration-150
          "
				>
					{languages.map((lang) => {
						const isActive = lang.code === selected.code;
						return (
							<li
								key={lang.code}
								role="option"
								aria-selected={isActive}
								tabIndex={0}
								onClick={() => handleSelect(lang)}
								onKeyDown={(e) => e.key === "Enter" && handleSelect(lang)}
								className={`
                  flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                  text-sm cursor-pointer outline-none
                  text-neutral-900 dark:text-neutral-100
                  transition-colors duration-100
                  hover:bg-black/5 focus:bg-black/5
                  dark:hover:bg-white/8 dark:focus:bg-white/8
                  ${isActive ? "bg-black/4 dark:bg-white/6 font-medium" : "font-normal"}
                `}
							>
								<span className="text-base leading-none">{lang.flag}</span>
								<span className="flex-1">{lang.label}</span>
								{isActive && (
									<svg
										width="14"
										height="14"
										viewBox="0 0 14 14"
										fill="none"
										className="opacity-60 shrink-0"
									>
										<path
											d="M2.5 7L5.5 10L11.5 4"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}

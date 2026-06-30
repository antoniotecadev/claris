import Image from "next/image";
import Google from "@/assets/images/SVG.png";

interface GoogleAuthButtonProps {
  text: string;
  id?: string;
}

export function GoogleAuthButton({ text, id }: GoogleAuthButtonProps) {
  return (
    <a
      href="http://localhost:3001/api/v1/auth/google"
      id={id}
      className="mb-5 flex items-center justify-center gap-2.5 rounded-[14px] border border-slate-200/80 bg-white/85 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-sm no-underline transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/8"
    >
      <Image src={Google} alt="Google" width={18} height={18} />
      <span>{text}</span>
    </a>
  );
}

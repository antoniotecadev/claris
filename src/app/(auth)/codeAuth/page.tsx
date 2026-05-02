"use client"

import Image from "next/image";
import { useRef, useState } from "react";
import Logo from "@/assets/images/lobo-SE.png"




123456

export default function CodeAuth() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getCode = () => digits.join("");

  const handleChange = (value: string, idx: number) => {
    const digit = value.replace(/\D/g, "")
    const newDigits = [...digits];
    newDigits[idx] = digit;
    setDigits(newDigits);

    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace") {
      if (digits[idx] === "" && idx > 0) {
        const newDigits = [...digits];
        newDigits[idx - 1] = "";
        setDigits(newDigits);
        inputRefs.current[idx - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[idx] = "";
        setDigits(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = Array(6).fill("");
    pasted.split("").forEach((char, i) => (newDigits[i] = char));
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = () => {
    const code = getCode();
    if (code.length < 6) return;
    console.log("Código:", code); 
    // fetch('/api/verify', { method: 'POST', body: JSON.stringify({ code }) })
  };

  return (
    <div className="bg-white flex w-screen justify-center items-center h-screen">
      <div className="w-7xl h-256 flex bg-amber-600">
        <div className="side1 w-[30%] h-full flex justify-between flex-col p-5">
          <div className="flex gap-2 p-5 items-center">
            <Image src={Logo} alt="" className="w-20 h-full" />
            <p className="text-white text-4xl">CLARIS</p>
          </div>
          <div className="flex flex-col gap-3 p-5">
            <p className="tracking-wide text-[#FFDEA5] text-[24px]">Momento de Reflexão</p>
            <p className="text-white italic text-[36px]">
              "A paz é o silêncio da alma em harmonia com o eterno."
            </p>
          </div>
        </div>

        <div className="bg-[#F3F3F3] w-[50%] flex justify-center items-center">
          <div className="flex w-md h-155 flex-col space-y-2">
            <p className="text-[#1A1C1C] text-[40px] italic">Confirme sua Identidade</p>
            <p className="text-[#43474E] mb-12">
              Para garantir a segurança do seu Claris, enviamos um código de
              verificação para o seu email.
            </p>

            <div className="flex gap-3 justify-between mb-8">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  className="w-12.5 h-20 bg-white rounded-2xl px-4 text-2xl text-center outline-none focus:ring-2 focus:ring-[#002045]"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={getCode().length < 6}
              className="w-full h-14 text-center bg-[#002045] text-white rounded-2xl mb-4 disabled:opacity-50"
            >
              Verificar Código
            </button>
            <button className="w-full h-14 text-center bg-white text-[#002045] rounded-2xl mb-16">
              Reenviar Código
            </button>
            <p className="text-[#43474E]">
              "Tudo o que fizerem, façam de todo o coração. -{" "}
              <span className="text-[#002045]">Colossenses 3:23</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



	


import { Check, CheckCircle2 } from "lucide-react";
import Image from 'next/image'
import Pastor from '@/assets/images/Pasted image.png'
import Graf from '@/assets/images/Pasted image (2).png'

export default function Simple() {
    return (
        <div className="bg-[#F2F4F6] text-[#464555]">
            <div className="m-auto container">
                <div className="flex py-17 gap-20" >
                    <div className="flex flex-col space-y-7 w-[50%]">
                        <h1 className="text-6xl font-bold text-[#191C1E]">Simplify your sacred<br /> work.</h1>
                        <h4 className=" text-2xl">Acreditamos que menos tempo em planilhas significa mais tempo cuidando de pessoas. Por isso, criámos uma arquitetura pensada para simplicidade e clareza.</h4>
                        <div className="flex gap-2">
                            <CheckCircle2 size={20} />
                            <div className="flex-col space-y-1">
                                <h1 className="font-bold text-2xl ">For Leadership</h1>
                                <h1>Data-driven insights to foster community growth.</h1>
                            </div>

                        </div>
                        <div className="flex gap-2">
                            <CheckCircle2 size={20} />
                            <div className="flex-col space-y-1">
                                <h1 className="font-bold text-2xl ">For Members</h1>
                                <h1>Engaging mobile experience for digital connection.</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-col">
                        <div className="flex gap-6 ">
                            <Image src={Pastor} alt="Pastor image" className="w-[340] h-[256] rounded-md" />
                            <div className="w-[340] h-[256] rounded-md bg-[#2B3EA2] flex flex-col p-6  text-white space-y-2">
                                <h1 className="text-3xl font-bold ">99</h1>
                                <h1 className="italic">“O Claris transformou totalmente a forma como cuidamos das pessoas na nossa igreja. É o parceiro silencioso que sempre nos fez falta.”</h1>
                                <h1>— Pastor Teca Pedro</h1>
                            </div>

                        </div>
                        <div className="bg-white rounded-2xl w-full h-[194] p-4  items-center flex justify-between">
                            <div className="flex flex-col">
                                <h1 className="text-[#191C1E] font-bold text-2xl">98% Retention Rate</h1>
                                <h2 className="text-[#464555] tracking-wide">Congregações mais conectadas do que nunca.</h2>
                            </div>
                            <Image src={Graf} alt="Grafico" width={100} height={100}/>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
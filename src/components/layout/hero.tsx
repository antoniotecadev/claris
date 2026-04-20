import Image from "next/image";
import igreja from "@/assets/images/unnamed.png"
import Conf from "./conf";

export default function Hero() {
    return (
        <section className="bg-white">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 justify-between items-start pt-10 px-2 mb-4 " >

                <div className=" flex flex-col gap-6 justify-center space-y-8 " >
                    <p className="text-[#191C1E] text-3xl wrap-break-word sm:text-5xl xl:text-6xl font-bold ">Modernize sua administração <span className="text-[#2B3EA2]">com graça.</span></p>
                    <p className="text-[#464555] sm:text-2xl">
                        Simplifique o ministério para focar no que realmente
                        importa: as pessoas. Uma plataforma completa desenhada
                        para a igreja moderna.
                    </p>
                    <div className="flex gap-2">
                        <button id="" className="px-6 py-2 text-white rounded-xl bg-bt md:px-20 md:py-5" >
                            Começar
                        </button>
                        <button className="px-6 py-2 rounded-xl bg-bt2" >
                            Ver demostração
                        </button>
                    </div>
                </div>
                <div className="bg-gray-200 items-center justify-center flex p-10 rounded-2xl " >
                    <Image src={igreja} alt="Igreja"  className="rotate-2 rounded-2xl" />
                </div>
            </div>
        <Conf />
        </section>

    )
}
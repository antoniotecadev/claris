import Image from "next/image";
import igreja from "@/assets/images/unnamed.png"
import Conf from "./conf";

export default function Hero() {
    return (
        <section className="bg-white">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2" >

                <div className=" flex flex-col gap-6 justify-center space-y-8" >
                    <h1 className="text-[#191C1E] text-6xl font-bold ">Modernize sua <br />administração <span className="text-[#2B3EA2]">com <br />graça.</span></h1>
                    <h4 className="text-[#464555]">
                        Simplifique o ministério para focar no que realmente
                        importa: as pessoas. Uma plataforma completa desenhada
                        para a igreja moderna.
                    </h4>
                    <div className="flex gap-6">
                        <button id="button" >
                            Começar
                        </button>
                        <button id="button1" >
                            Ver demostração
                        </button>
                    </div>
                </div>
                <div className="bg-gray-200 items-center justify-center flex p-10 rounded-2xl mt-25 mb-10" >
                    <Image src={igreja} alt="Igreja"  className="rotate-2 rounded-2xl" />
                </div>
            </div>
        <Conf />
        </section>

    )
}
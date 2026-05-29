"use client";

import Image from "next/image";
import Logo from "@/assets/images/lobo-SE.png"
import { ArrowRight } from "lucide-react";
import { useMessages } from "@/i18n/messages";

export default function Login() {
	const { t } = useMessages();

	return (
		<div className="bg-[#E5E5E5]">
			<div className="container m-auto  flex flex-col justify-center items-center h-screen ">
				<section className="  flex  w-7xl h-291.5 ">
					<div className="side2 w-10 h-full flex justify-between flex-col  p-5">
						<div className="flex gap-2 p-5  items-center">
							<Image src={Logo} alt="" className="w-20 h-full" />
							<p className="text-white text-4xl">CLARIS</p>
						</div>
						<div className="flex flex-col gap-3 items-center justify-center">
							<p className="text-[#FFDEA5] tracking-wide text-[30px]">{t("auth.adminRegister.scriptureLabel")}</p>
							<p className="italic text-white   text-[50px] text-center font-serif">
								"{t("auth.adminRegister.scriptureQuote")}"
							</p>
							<p className="text-[#86A0CD] text-[24px]">{t("auth.adminRegister.scriptureSource")}</p>
						</div>
						<div className="flex justify-around text-white">
						</div>
					</div>
					<div className="w-full  h-full flex flex-col py-20 items-center gradientes">
						<div className="w-159 h-181 flex flex-col">
							<p className="text-[36px] text-[#002045] font-serif italic mb-4">{t("auth.adminRegister.title")}</p>
							<p className="text-[#43474E] mb-12">{t("auth.adminRegister.subtitle")}</p>
							<div className="flex gap-3 mb-6">
								<p className="bg-[#FFDEA5] text-[#1A1C1C] px-4 rounded-2xl"> 1</p>
								<p className="text-[#002045]">{t("auth.adminRegister.steps.personal")}</p>
							</div>
							<div className="flex ">
								<form action="" className="flex flex-col  w-full">
									<div className="flex justify-between gap-4 ">
										<div className="flex flex-col w-[50%]">
											<label htmlFor="fullNmae" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.fullName")}</label>
											<input type="text" required id="fullNmae" placeholder="ex. Delson Pedro" className="text-[#6B7280]  bg-white rounded-2xl h-13.5 p-4" />
											<label htmlFor="pass" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.password")}</label>
											<input type="password" required id="pss" placeholder="........" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-1" />
											<label htmlFor="passC" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.confirmPassword")}</label>
											<input type="password" required id="pssC" placeholder="........" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-10" />
										</div>
										<div className="flex flex-col w-[50%]">
											<label htmlFor="fullNmae" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.email")}</label>
											<input type="email" required id="fullNmae" placeholder="ex. delsonpedro@church.com" className="text-[#6B7280]  bg-white rounded-2xl h-13.5 p-4 mb-1" />
											<label htmlFor="tel" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.phone")}</label>
											<input type="text" required id="tel" placeholder="9xx xxx xxx" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-1" />
											<label htmlFor="photo" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.photo")}</label>
											<input type="file" accept="image/png" id="photo" placeholder="9xx xxx xxx" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-11" />
										</div>
									</div>
									<div className="flex gap-3 mb-6">
										<p className="bg-[#FFDEA5] text-[#1A1C1C] px-4 rounded-2xl">2</p>
										<p className="text-[#002045]">{t("auth.adminRegister.steps.church")}</p>
									</div>
									<div className="flex justify-between gap-4 ">
										<div className="flex flex-col w-[50%]" >
											<label htmlFor="fullNmae" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.churchName")}</label>
											<input type="text" required id="fullNmae" placeholder="ex. Jesus Cristo" className=" text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-1" />
											<label htmlFor="local"  className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.location")}</label>
											<input type="text" required id="local" placeholder="município, bairro .." className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-1" />
										</div>
										<div className="flex flex-col w-[50%] ">
											<label htmlFor="fullNmae" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.churchEmail")}</label>
											<input type="text" required id="fullNmae" placeholder="ex. delsonpedro@church.com" className="text-[#6B7280]  bg-white rounded-2xl h-13.5 p-4" />
											<label htmlFor="photo" className="mb-1 text-[#43474E]">{t("auth.adminRegister.fields.logo")}</label>
											<input type="file" accept="image/png" id="photo" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-11" />
										</div>
									</div>
									<button type="submit" className="bg-[#002045] flex justify-center items-center gap-4 text-white h-14 rounded-2xl mb-10 hover:cursor-pointer">
										<p>{t("auth.adminRegister.submit")}</p>
										<ArrowRight size={20} />
									</button>
									<div className="flex justify-between items-center">
										<div className="w-35 h-px bg-gray-400"></div>
										<p className="text-gray-500 text-[12px]">
											{t("auth.adminRegister.already")}
											<span className="text-[#002045]">{t("auth.adminRegister.login")}</span>
										</p>
										<div className="w-35 h-px bg-gray-400"></div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
				<div className="flex justify-around p-3  sm:w-7xl  bg-white tracking-wide w-full  text-[#74777F] items-center h-27.25">
					<p className="text-[#002045] italic">CLARIS</p>
					<div className="flex gap-4">
						<p>{t("auth.adminRegister.footer.privacy")}</p>
						<p>{t("auth.adminRegister.footer.terms")}</p>
						<p>{t("auth.adminRegister.footer.support")}</p>
						<p>{t("auth.adminRegister.footer.contacts")}</p>
					</div>
					<p>© 2024 CLARIS ORGANIZATION</p>
				</div>

			</div>
		</div>
	);
}






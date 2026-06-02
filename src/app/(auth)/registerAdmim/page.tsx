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
						<p className="text-[50px] italic text-center font-serif text-white leading-tight">"Que tudo seja feito com decência e ordem"</p>
						<p className="text-[24px] text-sky-200/80">— 1 Coríntios 14:40</p>
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
				</div>

				<div className="w-full md:w-[55%] flex flex-col justify-center bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.95))] p-7 self-stretch md:p-10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))]">
					<div className="mx-auto flex w-full max-w-4xl flex-col px-2 md:px-0">
						<p className="mb-2 font-serif text-[36px] italic text-slate-900 dark:text-white">Comece sua jornada de gestão.</p>
						<p className="mb-8 text-slate-500 dark:text-slate-300">Crie uma conta administrativa para gerenciar a presença digital da sua igreja.</p>

						<div className="mb-6 flex gap-3">
							<p className="rounded-2xl bg-amber-200 px-4 text-slate-900 dark:bg-amber-300">1</p>
							<p className="text-sky-800 dark:text-sky-300">Dados pessoais</p>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
								<label className="mb-1 block text-slate-500 dark:text-slate-300">Nome completo</label>
								<input type="text" required placeholder="ex. Delson Pedro" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Senha</label>
								<input type="password" required placeholder="........" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Confirmar senha</label>
								<input type="password" required placeholder="........" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />
							</div>

							<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
								<label className="mb-1 block text-slate-500 dark:text-slate-300">E-mail</label>
								<input type="email" required placeholder="ex. delsonpedro@church.com" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Telefone</label>
								<input type="text" required placeholder="9xx xxx xxx" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Foto</label>
								<input type="file" accept="image/png" className="w-full rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300" />
							</div>
						</div>

						<div className="mt-6 mb-6 flex gap-3">
							<p className="rounded-2xl bg-amber-200 px-4 text-slate-900 dark:bg-amber-300">2</p>
							<p className="text-sky-800 dark:text-sky-300">Dados da igreja</p>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
								<label className="mb-1 block text-slate-500 dark:text-slate-300">Nome da igreja</label>
								<input type="text" required placeholder="ex. Jesus Cristo" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Localização</label>
								<input type="text" required placeholder="município, bairro .." className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />
							</div>

							<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
								<label className="mb-1 block text-slate-500 dark:text-slate-300">E-mail da igreja</label>
								<input type="text" required placeholder="ex. contato@church.com" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Logo</label>
								<input type="file" accept="image/png" className="w-full rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300" />
							</div>
						</div>

						<div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<button type="submit" className="inline-flex items-center justify-center gap-4 rounded-2xl bg-slate-950 px-6 py-4 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_18px_30px_rgba(15,23,42,0.18)] dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
								<p>CRIAR CONTA</p>
								<ArrowRight size={20} />
							</button>
							<p className="text-sm text-slate-500 dark:text-slate-300">Já tens uma conta na Claris? <span className="font-semibold text-sky-800 dark:text-sky-300">Entrar</span></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}






"use client";

import React, { useState, useTransition } from "react";
import { useMessages } from "@/i18n/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { FeedbackToast } from "@/components/ui/feedback-toast";
import { MessageToast } from "@/components/ui/message-toast";
import {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldSet,
	FieldContent,
} from "@/components/ui/field";
import { useTheme } from "next-themes";
import {
	Sun,
	Moon,
	Palette,
	Type,
	Box,
	Check,
	Info,
	AlertTriangle,
	Sparkles,
	MessageSquare,
	Eye,
	Code,
	HelpCircle,
	ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DesignSystemPage() {
	const { theme, setTheme } = useTheme();
	const params = useParams();
	const lang = (params?.lang as string) || "pt";

	// Toast states
	const [feedbackToast, setFeedbackToast] = useState<{
		open: boolean;
		title: string;
		description?: string;
		variant: "success" | "error" | "info";
	}>({ open: false, title: "", variant: "info" });

	const [messageToast, setMessageToast] = useState<{
		open: boolean;
		senderName: string;
		message: string;
		avatarUrl?: string;
	}>({ open: false, senderName: "", message: "" });

	// Form field state
	const [nameInput, setNameInput] = useState("");
	const [descInput, setDescInput] = useState("");
	const [showError, setShowError] = useState(false);

	// Tabs for component selection
	const [activeTab, setActiveTab] = useState<"all" | "tokens" | "components">("all");

	const triggerFeedback = (variant: "success" | "error" | "info") => {
		const titles = {
			success: "Sucesso!",
			error: "Erro de Validação",
			info: "Informação",
		};
		const descriptions = {
			success: "A sua ação foi concluída com sucesso no sistema.",
			error: "Por favor, corrija os erros assinalados no formulário.",
			info: "Existe uma nova atualização de design disponível.",
		};
		setFeedbackToast({
			open: true,
			title: titles[variant],
			description: descriptions[variant],
			variant,
		});
	};

	const triggerMessage = () => {
		setMessageToast({
			open: true,
			senderName: "Maria Silva (Design System)",
			message: "Estás a ver esta notificação? Foi disparada pelo componente MessageToast!",
		});
	};

	return (
		<div className="min-h-screen bg-background text-foreground transition-colors duration-300">
			{/* Toasts integration */}
			<FeedbackToast
				open={feedbackToast.open}
				title={feedbackToast.title}
				description={feedbackToast.description}
				variant={feedbackToast.variant}
				onClose={() => setFeedbackToast((prev) => ({ ...prev, open: false }))}
			/>

			<MessageToast
				open={messageToast.open}
				senderName={messageToast.senderName}
				message={messageToast.message}
				onClose={() => setMessageToast((prev) => ({ ...prev, open: false }))}
			/>

			{/* Decorative dynamic top bar */}
			<div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-sm" />

			{/* Header */}
			<header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<Link
							href={`/${lang}`}
							className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
						>
							<ArrowLeft size={16} />
						</Link>
						<div>
							<h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
								<Sparkles size={20} className="text-blue-600 animate-pulse" />
								Claris Design System
							</h1>
							<p className="text-xs text-muted-foreground">
								Tokens visuais e biblioteca de componentes reutilizáveis
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{/* Tab Switcher */}
						<div className="flex bg-muted p-1 rounded-xl border border-border">
							{(["all", "tokens", "components"] as const).map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
										activeTab === tab
											? "bg-background text-foreground shadow-xs"
											: "text-muted-foreground hover:text-foreground"
									}`}
								>
									{tab === "all" ? "Tudo" : tab}
								</button>
							))}
						</div>

						{/* Dark/Light mode toggle */}
						<Button
							variant="outline"
							size="icon"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							aria-label="Alternar tema"
							className="rounded-xl border-border bg-card hover:bg-muted"
						>
							<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
							<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Navigation sidebar */}
					<aside className="lg:col-span-1 space-y-6">
						<div className="bg-card rounded-2xl border border-border p-5 shadow-xs space-y-4">
							<h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
								Sobre este Módulo
							</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								Este módulo agrupa uma palete de cores dinâmica, sistema tipográfico unificado, icons responsivos e <strong>10 componentes UI reutilizáveis</strong> construídos com Tailwind CSS v4 e Radix UI.
							</p>
							<div className="pt-2">
								<h4 className="text-xs font-bold text-foreground mb-2">Resumo dos 10 Componentes:</h4>
								<ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
									<li>Button</li>
									<li>Dialog (Modais)</li>
									<li>DropdownMenu</li>
									<li>FeedbackToast</li>
									<li>Field (Form Wrappers)</li>
									<li>Input</li>
									<li>Label</li>
									<li>MessageToast</li>
									<li>Separator</li>
									<li>Textarea</li>
								</ul>
							</div>
						</div>

						<div className="bg-card rounded-2xl border border-border p-5 shadow-xs">
							<h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
								<Palette size={16} className="text-blue-500" /> Cores Rápidas
							</h3>
							<div className="space-y-2.5">
								<div className="flex items-center gap-2 text-xs">
									<div className="w-5 h-5 rounded-md bg-primary border border-border shrink-0" />
									<span>Primary (Marca/Ações)</span>
								</div>
								<div className="flex items-center gap-2 text-xs">
									<div className="w-5 h-5 rounded-md bg-secondary border border-border shrink-0" />
									<span>Secondary (Secundária)</span>
								</div>
								<div className="flex items-center gap-2 text-xs">
									<div className="w-5 h-5 rounded-md bg-accent border border-border shrink-0" />
									<span>Accent (Destaques)</span>
								</div>
								<div className="flex items-center gap-2 text-xs">
									<div className="w-5 h-5 rounded-md bg-destructive border border-border shrink-0" />
									<span>Destructive (Erros/Perigo)</span>
								</div>
							</div>
						</div>
					</aside>

					{/* Showcase Area */}
					<div className="lg:col-span-3 space-y-10">
						{/* 1. TOKENS SECTION */}
						{(activeTab === "all" || activeTab === "tokens") && (
							<section className="space-y-6 animate-in fade-in duration-300">
								<div className="border-b border-border pb-3">
									<h2 className="text-2xl font-bold flex items-center gap-2">
										<Palette className="text-blue-600" /> 1. Tokens de Design
									</h2>
									<p className="text-sm text-muted-foreground mt-1">
										Cores semânticas baseadas em HSL/oklch e o nosso sistema tipográfico global.
									</p>
								</div>

								{/* Color Palette Grid */}
								<div className="bg-card rounded-2xl border border-border p-6 shadow-xs">
									<h3 className="text-lg font-semibold mb-4">Palete de Cores Dinâmica</h3>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
										{[
											{ name: "Background", class: "bg-background text-foreground", desc: "Fundo principal" },
											{ name: "Foreground", class: "bg-foreground text-background", desc: "Texto principal" },
											{ name: "Primary", class: "bg-primary text-primary-foreground", desc: "Ações principais" },
											{ name: "Secondary", class: "bg-secondary text-secondary-foreground", desc: "Ações de suporte" },
											{ name: "Muted", class: "bg-muted text-muted-foreground", desc: "Fundo neutro leve" },
											{ name: "Accent", class: "bg-accent text-accent-foreground", desc: "Estados ativos/hover" },
											{ name: "Destructive", class: "bg-destructive text-white", desc: "Mensagens de erro" },
											{ name: "Border", class: "bg-background border-2 border-border text-foreground", desc: "Divisores e bordas" },
										].map((color) => (
											<div key={color.name} className="flex flex-col border border-border rounded-xl overflow-hidden bg-background shadow-xs">
												<div className={`h-16 ${color.class} flex items-center justify-center text-xs font-bold px-2 text-center`}>
													{color.name}
												</div>
												<div className="p-3 text-xs bg-card">
													<p className="font-semibold text-foreground">{color.name}</p>
													<p className="text-muted-foreground text-[10px] mt-0.5">{color.desc}</p>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Typography Card */}
								<div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
									<h3 className="text-lg font-semibold flex items-center gap-2">
										<Type className="text-purple-600" /> Tipografia & Escala de Textos
									</h3>
									<div className="space-y-4 divide-y divide-border">
										<div className="pt-0">
											<span className="text-xs text-muted-foreground font-mono">Heading 1 (text-3xl / font-bold)</span>
											<h1 className="text-3xl font-bold mt-1 text-foreground">Título Principal do Sistema</h1>
										</div>
										<div className="pt-3">
											<span className="text-xs text-muted-foreground font-mono">Heading 2 (text-xl / font-semibold)</span>
											<h2 className="text-xl font-semibold mt-1 text-foreground">Subtítulo de Seção</h2>
										</div>
										<div className="pt-3">
											<span className="text-xs text-muted-foreground font-mono">Body Normal (text-base / leading-relaxed)</span>
											<p className="text-base leading-relaxed mt-1 text-muted-foreground">
												O corpo de texto principal usa a fonte Inter. É otimizado para legibilidade tanto em interfaces claras como escuras.
											</p>
										</div>
										<div className="pt-3">
											<span className="text-xs text-muted-foreground font-mono">Muted Detail (text-xs / text-muted-foreground)</span>
											<p className="text-xs text-muted-foreground mt-1">
												Detalhes secundários, metadados, legendas ou termos que requerem menor destaque visual.
											</p>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* 2. COMPONENTS SECTION */}
						{(activeTab === "all" || activeTab === "components") && (
							<section className="space-y-6 animate-in fade-in duration-300">
								<div className="border-b border-border pb-3">
									<h2 className="text-2xl font-bold flex items-center gap-2">
										<Box className="text-indigo-600" /> 2. Componentes UI Reutilizáveis (Mínimo: 10)
									</h2>
									<p className="text-sm text-muted-foreground mt-1">
										Componentes individuais prontos a usar e altamente costumizáveis em qualquer parte da aplicação.
									</p>
								</div>

								{/* Component 1: Button */}
								<div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
									<div className="flex items-center justify-between gap-4 border-b border-border pb-3">
										<div>
											<h3 className="text-lg font-bold flex items-center gap-2">
												<span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">1</span>
												Componente: Button
											</h3>
											<p className="text-xs text-muted-foreground mt-0.5">src/components/ui/button.tsx</p>
										</div>
										<span className="text-xs font-mono text-muted-foreground">&lt;Button&gt;</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Apresenta animação suave ao pairar (hover) e ao clicar (active), com sombras semânticas dinâmicas.
									</p>
									<div className="flex flex-wrap gap-3 items-center">
										<Button variant="default">Default Button</Button>
										<Button variant="secondary">Secondary</Button>
										<Button variant="outline">Outline</Button>
										<Button variant="ghost">Ghost Link</Button>
										<Button variant="destructive">Destructive</Button>
										<Button variant="link">Link Style</Button>
									</div>
									<div className="flex flex-wrap gap-3 items-center pt-2">
										<Button size="xs" variant="outline">Size XS</Button>
										<Button size="sm" variant="outline">Size SM</Button>
										<Button size="default" variant="outline">Size Default</Button>
										<Button size="lg" variant="outline">Size LG</Button>
									</div>
								</div>

								{/* Components 2-7: Form controls (Input, Textarea, Label, Field components, Separator) */}
								<div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
									<div className="flex items-center justify-between gap-4 border-b border-border pb-3">
										<div>
											<h3 className="text-lg font-bold flex items-center gap-2">
												<span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">2 - 7</span>
												Componentes: Field, Label, Input, Textarea, Separator
											</h3>
											<p className="text-xs text-muted-foreground mt-0.5">
												src/components/ui/[field.tsx, label.tsx, input.tsx, textarea.tsx, separator.tsx]
											</p>
										</div>
										<span className="text-xs font-mono text-muted-foreground">Combinação de formulário</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Esses 5 componentes trabalham juntos para criar blocos de formulários acessíveis e com tratamento visual para estados de erro, foco e placeholders.
									</p>

									<div className="space-y-6 pt-2">
										<FieldSet className="max-w-md">
											{/* Field wrapping Label & Input */}
											<Field>
												<FieldLabel htmlFor="nome-exemplo">Nome Completo</FieldLabel>
												<Input
													id="nome-exemplo"
													placeholder="Escreve o teu nome..."
													value={nameInput}
													onChange={(e) => setNameInput(e.target.value)}
												/>
												<FieldDescription>O nome que será exibido no seu perfil público.</FieldDescription>
											</Field>

											{/* Separator component (Horizontal) */}
											<div className="py-2">
												<Separator />
												<div className="text-center -mt-2.5">
													<span className="bg-card px-2 text-[10px] uppercase font-bold text-muted-foreground">Seção Opcional</span>
												</div>
											</div>

											{/* Field wrapping Label & Textarea with conditional error */}
											<Field data-invalid={showError}>
												<FieldLabel htmlFor="desc-exemplo">Biografia (Textarea)</FieldLabel>
												<Textarea
													id="desc-exemplo"
													placeholder="Conte-nos um pouco sobre a sua experiência comunitária..."
													value={descInput}
													onChange={(e) => setDescInput(e.target.value)}
												/>
												<FieldDescription>Breve introdução pessoal ou histórico da comunidade.</FieldDescription>
												{showError && (
													<FieldError>O campo biografia não pode conter termos impróprios.</FieldError>
												)}
											</Field>
										</FieldSet>

										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => setShowError(!showError)}
											>
												Toggle Error State
											</Button>
											<Button
												size="sm"
												variant="secondary"
												onClick={() => {
													setNameInput("");
													setDescInput("");
													setShowError(false);
												}}
											>
												Limpar Campos
											</Button>
										</div>
									</div>
								</div>

								{/* Component 8: Dialog */}
								<div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
									<div className="flex items-center justify-between gap-4 border-b border-border pb-3">
										<div>
											<h3 className="text-lg font-bold flex items-center gap-2">
												<span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">8</span>
												Componente: Dialog (Modais)
											</h3>
											<p className="text-xs text-muted-foreground mt-0.5">src/components/ui/dialog.tsx</p>
										</div>
										<span className="text-xs font-mono text-muted-foreground">&lt;Dialog&gt;</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Um modal acessível construído no topo do Radix Dialog. Inclui animações de fade e zoom in, com suporte para rodapé estilizado e fecho com tecla ESC.
									</p>
									<div className="pt-2">
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="default" className="flex items-center gap-2">
													<Eye size={15} /> Abrir Modal de Exemplo
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Confirmar Ação</DialogTitle>
													<DialogDescription>
														Deseja realmente aplicar este módulo de design system? Esta ação adicionará uma nova rota de visualização à aplicação.
													</DialogDescription>
												</DialogHeader>
												<div className="py-2 text-sm text-muted-foreground">
													Pode colocar qualquer conteúdo customizado aqui dentro, como formulários ou mensagens importantes.
												</div>
												<DialogFooter showCloseButton>
													<DialogClose asChild>
														<Button variant="default" onClick={() => triggerFeedback("success")}>
															Confirmar e Salvar
														</Button>
													</DialogClose>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</div>
								</div>

								{/* Component 9: DropdownMenu */}
								<div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
									<div className="flex items-center justify-between gap-4 border-b border-border pb-3">
										<div>
											<h3 className="text-lg font-bold flex items-center gap-2">
												<span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">9</span>
												Componente: DropdownMenu
											</h3>
											<p className="text-xs text-muted-foreground mt-0.5">src/components/ui/dropdown-menu.tsx</p>
										</div>
										<span className="text-xs font-mono text-muted-foreground">&lt;DropdownMenu&gt;</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Menu suspenso avançado que suporta títulos, divisores, atalhos de teclado e submenus aninhados.
									</p>
									<div className="pt-2">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline">Mostrar Menu de Opções</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="w-56">
												<DropdownMenuLabel>A minha Conta</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuGroup>
													<DropdownMenuItem onClick={() => triggerFeedback("info")}>
														Perfil do Utilizador
														<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
													</DropdownMenuItem>
													<DropdownMenuItem onClick={() => triggerFeedback("info")}>
														Configurações
														<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
													</DropdownMenuItem>
												</DropdownMenuGroup>
												<DropdownMenuSeparator />
												<DropdownMenuSub>
													<DropdownMenuSubTrigger>Convidar Amigos</DropdownMenuSubTrigger>
													<DropdownMenuSubContent>
														<DropdownMenuItem onClick={() => triggerFeedback("success")}>E-mail</DropdownMenuItem>
														<DropdownMenuItem onClick={() => triggerFeedback("success")}>Mensagem Direta</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuSub>
												<DropdownMenuSeparator />
												<DropdownMenuItem variant="destructive" onClick={() => triggerFeedback("error")}>
													Terminar Sessão
													<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								{/* Component 10: FeedbackToast & MessageToast */}
								<div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
									<div className="flex items-center justify-between gap-4 border-b border-border pb-3">
										<div>
											<h3 className="text-lg font-bold flex items-center gap-2">
												<span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">10</span>
												Componentes: FeedbackToast & MessageToast
											</h3>
											<p className="text-xs text-muted-foreground mt-0.5">
												src/components/ui/[feedback-toast.tsx, message-toast.tsx]
											</p>
										</div>
										<span className="text-xs font-mono text-muted-foreground">Notificações Temporárias</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Banners flutuantes animados que alertam o utilizador sobre eventos cruciais no sistema ou mensagens recebidas em tempo real.
									</p>
									<div className="flex flex-wrap gap-3 pt-2">
										<Button
											variant="outline"
											className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
											onClick={() => triggerFeedback("success")}
										>
											Disparar Toast Sucesso
										</Button>
										<Button
											variant="outline"
											className="border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
											onClick={() => triggerFeedback("error")}
										>
											Disparar Toast Erro
										</Button>
										<Button
											variant="outline"
											className="border-blue-500/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
											onClick={() => triggerFeedback("info")}
										>
											Disparar Toast Info
										</Button>
										<Button
											variant="default"
											className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
											onClick={triggerMessage}
										>
											Disparar MessageToast
										</Button>
									</div>
								</div>
							</section>
						)}
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-border bg-card py-6 mt-16 text-center text-xs text-muted-foreground">
				<p>© {new Date().getFullYear()} Claris. Todos os direitos reservados. Design System construído com ❤️.</p>
			</footer>
		</div>
	);
}

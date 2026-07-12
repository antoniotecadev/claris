"use client"

import { useEffect, useRef, useState } from "react"
import { Calendar, Check, Clock, ImagePlus, Loader2, MapPin, PencilLine, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getAuthToken } from "@/lib/auth-cookies"
import { useMessages } from "@/i18n/messages"
import { FeedbackToast } from "@/components/ui/feedback-toast"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

type CreateEventDialogProps = {
	organizationId: string
	onSuccess?: () => void
	children?: React.ReactNode
}

export function CreateEventDialog({
	organizationId,
	onSuccess,
	children,
}: CreateEventDialogProps) {
	const { t } = useMessages()
	const [open, setOpen] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	// Toast state
	const [toastOpen, setToastOpen] = useState(false)
	const [toastTitle, setToastTitle] = useState("")
	const [toastDescription, setToastDescription] = useState<string | undefined>(undefined)
	const [toastVariant, setToastVariant] = useState<"success" | "error" | "info">("info")

	const showToast = (title: string, description?: string, variant: "success" | "error" | "info" = "info") => {
		setToastTitle(title)
		setToastDescription(description)
		setToastVariant(variant)
		setToastOpen(true)
	}

	useEffect(() => {
		if (!toastOpen) return
		const id = window.setTimeout(() => setToastOpen(false), 4200)
		return () => window.clearTimeout(id)
	}, [toastOpen])

	// Campos do formulário
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [date, setDate] = useState("")
	const [time, setTime] = useState("")
	const [location, setLocation] = useState("")
	const [photo, setPhoto] = useState<File | null>(null)
	const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
	const photoPreviewRef = useRef<string | null>(null)

	useEffect(() => {
		return () => {
			if (photoPreviewRef.current) {
				URL.revokeObjectURL(photoPreviewRef.current)
			}
		}
	}, [])

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		setPhoto(file ?? null)
		if (photoPreviewRef.current) {
			URL.revokeObjectURL(photoPreviewRef.current)
			photoPreviewRef.current = null
		}
		if (!file) {
			setPhotoPreviewUrl(null)
			return
		}
		const previewUrl = URL.createObjectURL(file)
		photoPreviewRef.current = previewUrl
		setPhotoPreviewUrl(previewUrl)
	}

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen)
		if (!nextOpen) resetForm()
	}

	const resetForm = () => {
		setTitle("")
		setDescription("")
		setDate("")
		setTime("")
		setLocation("")
		setPhoto(null)
		if (photoPreviewRef.current) {
			URL.revokeObjectURL(photoPreviewRef.current)
			photoPreviewRef.current = null
		}
		setPhotoPreviewUrl(null)
	}

	const handleSubmit = async () => {
		const cleanTitle = title.trim()
		if (cleanTitle.length < 2 || cleanTitle.length > 120) {
			showToast(t("events.toast.invalidTitle"), t("events.toast.titleLengthError"), "error")
			return
		}
		if (!date || !time) {
			showToast(t("events.toast.requiredDateTime"), undefined, "error")
			return
		}

				const localDateString = `${date}T${time}`;
				const combinedDate = new Date(`${localDateString}:00`);
				const now = new Date();
				const marginMs = 60 * 1000;
				if (combinedDate.getTime() < now.getTime() - marginMs) {
					showToast(t("events.toast.pastDate"), undefined, "error")
					return
				}
			if (Number.isNaN(combinedDate.getTime())) {
				showToast(t("events.toast.invalidDateTime"), undefined, "error")
				return
			}

		setSubmitting(true)
		try {
			const formData = new FormData()
			formData.append("title", cleanTitle)
			formData.append("description", description.trim())
			formData.append("date", combinedDate.toISOString())
			formData.append("location", location.trim())

			if (photo) {
				formData.append("photoUrl", photo) // campo do FileInterceptor('photoUrl') no backend
			}

			const token = await getAuthToken()

			const response = await fetch(
				`${BASE_URL}/organizations/${organizationId}/events`,
				{
					method: "POST",
					body: formData,
					headers: { Authorization: `Bearer ${token}` },
				},
			)

			if (!response.ok) {
				const errorJson = await response.json().catch(() => ({}))
				const errorMessage = Array.isArray(errorJson?.message)
					? errorJson.message[0]
					: errorJson?.message || t("events.toast.createError")
				throw new Error(errorMessage)
			}

			showToast(t("events.toast.createSuccess"), undefined, "success")
			resetForm()
			setOpen(false)
			onSuccess?.()
		} catch (error) {
			showToast(error instanceof Error ? error.message : t("events.toast.createError"), undefined, "error")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogTrigger asChild>
					{children ?? (
						<Button className="h-12 w-fit rounded-2xl bg-[#FFDEA5] px-5 font-bold text-[#5D4201] shadow-sm hover:bg-[#FFD38A]">
							<Plus size={18} />
							<span>{t("events.create.submit")}</span>
						</Button>
					)}
				</DialogTrigger>

				<DialogContent className="w-full max-h-[92vh] overflow-hidden p-0 sm:max-w-2xl md:max-w-4xl">
				<DialogHeader className="border-b border-slate-100 bg-linear-to-br from-brand-primary via-[#1E3A8A] to-accent-orange px-6 py-6 text-white">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
							<Calendar size={22} />
						</div>
						<div>
							<DialogTitle className="text-xl font-bold">
								{t("events.create.title") || "Criar Evento"}
							</DialogTitle>
							<DialogDescription className="mt-1 max-w-xl text-sm text-white/80">
								{t("events.create.subtitle") || "Organize e compartilhe eventos com a comunidade"}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="max-h-[calc(92vh-11rem)] overflow-auto px-6 py-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
						{/* Coluna do Banner */}
						<div className="space-y-3">
							<Label htmlFor="banner" className="text-sm font-semibold text-brand-primary">
								{t("events.edit.fields.banner")}
							</Label>
							<label
								htmlFor="banner"
								className="group flex aspect-video min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition-colors hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 w-full"
							>
								{photoPreviewUrl ? (
									<img
										src={photoPreviewUrl}
													alt={t("events.edit.fields.banner")}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex flex-col items-center px-8">
										<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#1E3A8A] shadow-sm">
											<ImagePlus size={30} />
										</div>
										<p className="text-sm font-semibold text-brand-primary">
											{t("events.edit.selectBanner")}
										</p>
										<p className="mt-2 text-xs leading-relaxed text-slate-500">
											{t("events.edit.bannerHint")}
										</p>
									</div>
								)}
								<span className="mb-4 mt-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1E3A8A] shadow-sm transition-transform group-hover:scale-105">
									<Upload size={14} />
									{photoPreviewUrl ? t("events.edit.changeBanner") : t("events.edit.selectBanner")}
								</span>
							</label>
							<input
								id="banner"
								type="file"
								accept="image/*"
								onChange={handlePhotoChange}
								className="sr-only"
							/>
						</div>

						{/* Coluna dos Campos */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{/* Título */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<Label htmlFor="event-title" className="text-sm font-semibold text-brand-primary">
									{t("events.create.fields.title") || "Título do Evento *"}
								</Label>
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="event-title"
										placeholder={t("events.create.placeholders.title") || "Ex: Culto de Domingo"}
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className="h-11 rounded-xl bg-white pl-10"
										maxLength={120}
									/>
								</div>
							</div>

							{/* Data */}
							<div className="flex flex-col gap-2">
								<Label htmlFor="event-date" className="text-sm font-semibold text-brand-primary">
									{t("events.create.fields.date") || "Data *"}
								</Label>
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="event-date"
										type="date"
										value={date}
										onChange={(e) => setDate(e.target.value)}
										className="h-11 rounded-xl bg-white pl-10"
									/>
								</div>
							</div>

							{/* Hora */}
							<div className="flex flex-col gap-2">
								<Label htmlFor="event-time" className="text-sm font-semibold text-brand-primary">
									{t("events.create.fields.startTime") || "Hora de Início *"}
								</Label>
								<div className="relative">
									<Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="event-time"
										type="time"
										value={time}
										onChange={(e) => setTime(e.target.value)}
										className="h-11 rounded-xl bg-white pl-10"
									/>
								</div>
							</div>

							{/* Local */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<Label htmlFor="event-location" className="text-sm font-semibold text-brand-primary">
									{t("events.create.fields.location") || "Local do Evento"}
								</Label>
								<div className="relative">
									<MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="event-location"
										placeholder={t("events.create.placeholders.location") || "Ex: Sala 101, Igreja Principal"}
										value={location}
										onChange={(e) => setLocation(e.target.value)}
										className="h-11 rounded-xl bg-white pl-10"
										maxLength={180}
									/>
								</div>
							</div>

							{/* Descrição */}
							<div className="md:col-span-2">
								<Label htmlFor="event-description" className="mb-2 block text-sm font-semibold text-brand-primary">
									{t("events.create.fields.description") || "Descrição"}
								</Label>
								<div className="relative">
									<PencilLine className="absolute left-3 top-3 size-4 text-slate-400" />
									<Textarea
										id="event-description"
										placeholder={t("events.create.placeholders.description") || "Descreva o evento em detalhes..."}
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										className="min-h-32 rounded-xl bg-white pl-10"
										maxLength={1000}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className="m-0 w-full border-t border-slate-100 bg-slate-50 px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline" className="h-10 rounded-xl">
							{t("common.cancel") || "Cancelar"}
						</Button>
					</DialogClose>
					<Button
						type="button"
						className="h-10 rounded-xl bg-[#1E3A8A] px-5 hover:bg-brand-primary"
						disabled={submitting}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							handleSubmit()
						}}
					>
						{submitting ? (
							<>
								<Loader2 size={16} className="animate-spin" />
								{t("common.saving") || "Salvando..."}
							</>
						) : (
							<>
								<Check size={16} />
								{t("events.create.submit") || "Criar Evento"}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		<FeedbackToast
			onClose={() => setToastOpen(false)}
			open={toastOpen}
			title={toastTitle}
			description={toastDescription}
			variant={toastVariant}
		/>
		</>
	)
}
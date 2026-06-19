"use client"

import { useEffect, useRef, useState } from "react"
import {
	Calendar,
	Check,
	Clock,
	ImagePlus,
	Loader2,
	MapPin,
	PencilLine,
	Upload,
} from "lucide-react"
import { useMessages } from "@/i18n/messages"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getAuthToken } from "@/lib/auth-cookies"

const BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1/api"

export type EditEventData = {
	id: string
	title: string
	interestedCount: number
	description: string | null
	date: string // ISO-8601
	location: string | null
	photoUrl: string | null
}

type EditEventDialogProps = {
	organizationId: string
	event: EditEventData | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onSuccess?: () => void
}

/**
 * Extracts the local date (YYYY-MM-DD) and time (HH:MM) from an ISO string
 * to pre-fill the date and time input fields.
 */
function parseISOToLocal(iso: string): { date: string; time: string } {
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return { date: "", time: "" }

	const yyyy = d.getFullYear()
	const mm = String(d.getMonth() + 1).padStart(2, "0")
	const dd = String(d.getDate()).padStart(2, "0")
	const hh = String(d.getHours()).padStart(2, "0")
	const min = String(d.getMinutes()).padStart(2, "0")

	return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` }
}

export function EditEventDialog({
	organizationId,
	event,
	open,
	onOpenChange,
	onSuccess,
}: EditEventDialogProps) {
	const { t } = useMessages()
	const [submitting, setSubmitting] = useState(false)

	// Form fields
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [date, setDate] = useState("")
	const [time, setTime] = useState("")
	const [location, setLocation] = useState("")
	const [photo, setPhoto] = useState<File | null>(null)
	const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
	const photoPreviewRef = useRef<string | null>(null)

	// Pre-fill form when event data changes or dialog opens
	useEffect(() => {
		if (event && open) {
			setTitle(event.title)
			setDescription(event.description ?? "")
			setLocation(event.location ?? "")

			const parsed = parseISOToLocal(event.date)
			setDate(parsed.date)
			setTime(parsed.time)

			setPhoto(null)
			if (photoPreviewRef.current) {
				URL.revokeObjectURL(photoPreviewRef.current)
				photoPreviewRef.current = null
			}
			setPhotoPreviewUrl(event.photoUrl || null)
		}
	}, [event, open])

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
			setPhotoPreviewUrl(event?.photoUrl || null)
			return
		}
		const previewUrl = URL.createObjectURL(file)
		photoPreviewRef.current = previewUrl
		setPhotoPreviewUrl(previewUrl)
	}

	const handleOpenChange = (nextOpen: boolean) => {
		onOpenChange(nextOpen)
		if (!nextOpen) {
			setPhoto(null)
			if (photoPreviewRef.current) {
				URL.revokeObjectURL(photoPreviewRef.current)
				photoPreviewRef.current = null
			}
		}
	}

	const handleSubmit = async () => {
		if (!event) return

		const cleanTitle = title.trim()
		if (cleanTitle.length < 2 || cleanTitle.length > 120) {
			alert(t("events.edit.errors.titleLength"))
			return
		}
		if (!date || !time) {
			alert(t("events.edit.errors.requiredDate"))
			return
		}

		const combinedDate = new Date(`${date}T${time}`)
		if (Number.isNaN(combinedDate.getTime())) {
			alert(t("events.edit.errors.invalidDate"))
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
				formData.append("photoUrl", photo)
			}

			const token = await getAuthToken()

			const response = await fetch(
				`${BASE_URL}/organizations/${organizationId}/events/${event.id}`,
				{
					method: "PATCH",
					body: formData,
					headers: { Authorization: `Bearer ${token}` },
				},
			)

			if (!response.ok) {
				const errorJson = await response.json().catch(() => ({}))
				const errorMessage = Array.isArray(errorJson?.message)
					? errorJson.message[0]
					: errorJson?.message || t("events.edit.errors.update")
				throw new Error(errorMessage)
			}

			onOpenChange(false)
			onSuccess?.()
		} catch (error) {
			alert(
				error instanceof Error
					? error.message
					: t("events.edit.errors.update"),
			)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="w-full max-h-[92vh] overflow-hidden p-0 sm:max-w-2xl md:max-w-4xl">
				<DialogHeader className="border-b border-slate-100 bg-linear-to-br from-[#002045] via-[#1E3A8A] to-[#D97706] px-6 py-6 text-white">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
							<PencilLine size={22} />
						</div>
						<div>
							<DialogTitle className="text-xl font-bold">
								{t("events.edit.title")}
							</DialogTitle>
							<DialogDescription className="mt-1 max-w-xl text-sm text-white/80">
								{t("events.edit.description")}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="max-h-[calc(92vh-11rem)] overflow-auto px-6 py-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
						{/* Coluna do Banner */}
						<div className="space-y-3">
							<Label
								htmlFor="edit-banner"
								className="text-sm font-semibold text-[#002045]"
							>
							{t("events.edit.fields.banner")}
						</Label>
							<label
								htmlFor="edit-banner"
								className="group flex aspect-video min-h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition-colors hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5"
							>
								{photoPreviewUrl ? (
									<img
										src={photoPreviewUrl}
										alt="preview banner"
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex flex-col items-center px-8">
										<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#1E3A8A] shadow-sm">
											<ImagePlus size={30} />
										</div>
										<p className="text-sm font-semibold text-[#002045]">
											{t("events.edit.selectBanner")}
										</p>
										<p className="mt-2 text-xs leading-relaxed text-slate-500">
											{t("events.edit.bannerHint")}
										</p>
									</div>
								)}
								<span className="mb-4 mt-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1E3A8A] shadow-sm transition-transform group-hover:scale-105">
									<Upload size={14} />
									{photoPreviewUrl
										? t("events.edit.changeBanner")
										: t("events.edit.selectBanner")}
								</span>
							</label>
							<input
								id="edit-banner"
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
								<Label
									htmlFor="edit-event-title"
									className="text-sm font-semibold text-[#002045]"
								>
									{t("events.edit.fields.title")}
								</Label>
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="edit-event-title"
										placeholder={t("events.edit.placeholders.title")}
										value={title}
										onChange={(e) =>
											setTitle(e.target.value)
										}
										className="h-11 rounded-xl bg-white pl-10"
										maxLength={120}
									/>
								</div>
							</div>

							{/* Data */}
							<div className="flex flex-col gap-2">
								<Label
									htmlFor="edit-event-date"
									className="text-sm font-semibold text-[#002045]"
								>
									{t("events.edit.fields.date")}
								</Label>
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="edit-event-date"
										type="date"
										value={date}
										onChange={(e) =>
											setDate(e.target.value)
										}
										className="h-11 rounded-xl bg-white pl-10"
									/>
								</div>
							</div>

							{/* Hora */}
							<div className="flex flex-col gap-2">
								<Label
									htmlFor="edit-event-time"
									className="text-sm font-semibold text-[#002045]"
								>
									{t("events.edit.fields.startTime")}
								</Label>
								<div className="relative">
									<Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="edit-event-time"
										type="time"
										value={time}
										onChange={(e) =>
											setTime(e.target.value)
										}
										className="h-11 rounded-xl bg-white pl-10"
									/>
								</div>
							</div>

							{/* Local */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<Label
									htmlFor="edit-event-location"
									className="text-sm font-semibold text-[#002045]"
								>
									{t("events.edit.fields.location")}
								</Label>
								<div className="relative">
									<MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="edit-event-location"
										placeholder={t("events.edit.placeholders.location")}
										value={location}
										onChange={(e) =>
											setLocation(e.target.value)
										}
										className="h-11 rounded-xl bg-white pl-10"
										maxLength={180}
									/>
								</div>
							</div>

							{/* Descrição */}
							<div className="md:col-span-2">
								<Label
									htmlFor="edit-event-description"
									className="mb-2 block text-sm font-semibold text-[#002045]"
								>
									{t("events.edit.fields.description")}
								</Label>
								<div className="relative">
									<PencilLine className="absolute left-3 top-3 size-4 text-slate-400" />
									<Textarea
										id="edit-event-description"
										placeholder={t("events.edit.placeholders.description")}
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
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
							{t("common.cancel")}
						</Button>
					</DialogClose>
					<Button
						type="button"
						className="h-10 rounded-xl bg-[#1E3A8A] px-5 hover:bg-[#002045]"
						disabled={submitting}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							handleSubmit()
						}}
					>
						{submitting ? (
							<>
								<Loader2
									size={16}
									className="animate-spin"
								/>
								{t("common.saving")}
							</>
						) : (
							<>
								<Check size={16} />
								{t("events.edit.save")}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Building2, Check, ImagePlus, Loader2, MapPin, PencilLine, Upload } from "lucide-react"
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
import OrganizatioSelect, { ChurchOption } from "@/components/layout/OrganizatioSelect"
import { getAuthToken } from "@/lib/auth-cookies"
import { useMessages } from "@/i18n/messages"

type DialogDemoProps = {
	churches?: ChurchOption[]
	loadingChurches?: boolean
	onOpen?: () => void
	onSuccess?: () => void  // ← novo: para recarregar lista após criação
	setOrganizations?: React.Dispatch<React.SetStateAction<OrganizationRef[]>>
	onToast?: (payload: { title: string; description?: string; variant: "success" | "error" | "info" }) => void
}

type OrganizationRef = {
	id: string
	churchId: string
	organizationId: string
	name: string
	slug: string
	logoUrl: string | null
	role: string
	description: string
	address: string
	memberCount: number
	createdAt: string | Date
}

export function DialogDemo({
	churches = [],
	loadingChurches = false,
	onOpen,
	onSuccess,
	setOrganizations,
	onToast,
}: DialogDemoProps) {
	const { t } = useMessages()
	const [open, setOpen] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	// Campos controlados
	const [name, setName] = useState("")
	const [address, setAddress] = useState("")
	const [churchId, setChurchId] = useState("")
	const [description, setDescription] = useState("")
	const [logoUrl, setLogoUrl] = useState<File | null>(null)
	const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
	const logoPreviewRef = useRef<string | null>(null)

	useEffect(() => {
		return () => {
			if (logoPreviewRef.current) {
				URL.revokeObjectURL(logoPreviewRef.current)
			}
		}
	}, [])

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		setLogoUrl(file ?? null)
		if (logoPreviewRef.current) {
			URL.revokeObjectURL(logoPreviewRef.current)
			logoPreviewRef.current = null
		}

		if (!file) {
			setLogoPreviewUrl(null)
			return
		}

		const previewUrl = URL.createObjectURL(file)
		logoPreviewRef.current = previewUrl
		setLogoPreviewUrl(previewUrl)
	}

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen)
		if (nextOpen) onOpen?.()
	}

	const resetForm = () => {
		setName("")
		setAddress("")
		setChurchId("")
		setDescription("")
		setLogoUrl(null)
		if (logoPreviewRef.current) {
			URL.revokeObjectURL(logoPreviewRef.current)
			logoPreviewRef.current = null
		}
		setLogoPreviewUrl(null)
	}

	const handleSubmit = async () => {
		if (!name.trim() || !churchId.trim()) {
			onToast?.({ title: t("church.create.validation"), variant: "error" });
			return
		}

		setSubmitting(true)
		try {
			const formData = new FormData()
			formData.append('name', name.trim())
			formData.append('churchId', churchId.trim())
			formData.append('address', address.trim())
			formData.append('description', description.trim())

			if (logoUrl) {
				formData.append('logoUrl', logoUrl) // mesmo nome do FileInterceptor
			}

			const token = await getAuthToken();

			const response = await fetch("http://localhost:3001/v1/api/organizations", {
				method: "POST",
				body: formData,
				headers: {
					Authorization: `Bearer ${token}`
				},
			})
			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(errorText || t("church.create.errors.create"))
			}

			const createdOrganization: OrganizationRef = {
				id: churchId,
				churchId,
				organizationId: churchId,
				name: name,
				slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
				description: description,
				logoUrl: logoPreviewUrl,
				role: "SUPER_ADMIN",
				address,
				memberCount: 0,
				createdAt: new Date().toISOString(),
			}

			resetForm()
			setOpen(false)
			onSuccess?.()  // ← notifica o pai para atualizar a lista
			onToast?.({ title: t("church.create.success"), variant: "success" })
			setOrganizations?.((prev) => [...prev, createdOrganization])
		} catch (error) {
			onToast?.({ title: error instanceof Error ? error.message : t("church.create.errors.create"), variant: "error" })
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="mt-8 h-12 w-56 rounded-2xl border-0 bg-[#FFDEA5] px-6 text-[#261900] shadow-sm hover:bg-[#FFD38A] hover:text-[#261900]"
				>
					<Building2 size={18} />
					{t("church.create.title")}
				</Button>
			</DialogTrigger>

			<DialogContent className="w-full max-h-[92vh] overflow-hidden p-0 sm:max-w-2xl md:max-w-4xl">
				<DialogHeader className="border-b border-slate-100 bg-linear-to-br from-[#002045] via-[#1E3A8A] to-[#D97706] px-6 py-6 text-white">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
							<Building2 size={22} />
						</div>
						<div>
							<DialogTitle className="text-xl font-bold">
								{t("church.create.title")}
							</DialogTitle>
							<DialogDescription className="mt-1 max-w-xl text-sm text-white/80">
								{t("church.create.description")}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="max-h-[calc(92vh-11rem)] overflow-auto px-6 py-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
						<div className="space-y-3">
							<Label htmlFor="logo" className="text-sm font-semibold text-[#002045]">
								{t("church.create.fields.logo")}
							</Label>
							<label
								htmlFor="logo"
								className="group flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition-colors hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5"
							>
								{logoPreviewUrl ? (
									<img
										src={logoPreviewUrl}
										alt="preview"
										className="h-full max-h-72 w-full object-contain p-4"
									/>
								) : (
									<div className="flex flex-col items-center px-8">
										<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#1E3A8A] shadow-sm">
											<ImagePlus size={30} />
										</div>
										<p className="text-sm font-semibold text-[#002045]">
											{t("church.create.fields.logo")}
										</p>
										<p className="mt-2 text-xs leading-relaxed text-slate-500">
											{t("church.create.imageHint")}
										</p>
										<span className="mb-4 mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1E3A8A] shadow-sm transition-transform group-hover:scale-105">
											<Upload size={14} />
											{logoPreviewUrl ? t("church.create.changeImage") : t("church.create.selectImage")}
										</span>
									</div>
								)}
							</label>
							<input
								id="logo"
								type="file"
								accept="image/*"
								onChange={handleLogoChange}
								className="sr-only"
							/>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor="church-name" className="text-sm font-semibold text-[#002045]">
									{t("church.create.fields.name")}
								</Label>
								<div className="relative">
									<Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="church-name"
										placeholder={t("church.create.placeholders.name")}
										value={name}
										onChange={(e) => setName(e.target.value)}
										maxLength={50}
										className="h-11 rounded-xl bg-white pl-10"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="church-address" className="text-sm font-semibold text-[#002045]">
									{t("church.create.fields.address")}
								</Label>
								<div className="relative">
									<MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="church-address"
										placeholder={t("church.create.placeholders.address")}
										value={address}
										onChange={(e) => setAddress(e.target.value)}
										className="h-11 rounded-xl bg-white pl-10"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2 md:col-span-2">
								<Label htmlFor="churchId" className="text-sm font-semibold text-[#002045]">
									{t("church.create.fields.church")}
								</Label>
								<OrganizatioSelect
									id="churchId"
									name="churchId"
									churches={churches}
									loading={loadingChurches}
									onChange={(value) => setChurchId(value)}
								/>
							</div>

							<div className="md:col-span-2">
								<Label htmlFor="description" className="mb-2 block text-sm font-semibold text-[#002045]">
									{t("church.create.fields.description")}
								</Label>
								<div className="relative">
									<PencilLine className="absolute left-3 top-3 size-4 text-slate-400" />
									<Textarea
										id="description"
										placeholder={t("church.create.placeholders.description")}
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										maxLength={100}
										className="min-h-32 rounded-xl bg-white pl-10"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className="m-0 w-full border-t border-slate-100 bg-slate-50 px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline" className="h-10 rounded-xl" onClick={resetForm}>
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
								<Loader2 size={16} className="animate-spin" />
								{t("common.saving")}
							</>
						) : (
							<>
								<Check size={16} />
								{t("common.saveChanges")}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

"use client"

import { useState } from "react"
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
}

export function DialogDemo({
	churches = [],
	loadingChurches = false,
	onOpen,
	onSuccess,
}: DialogDemoProps) {
	const { t } = useMessages()
	const [open, setOpen] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	// Campos controlados
	const [name, setName] = useState("")
	const [slug, setSlug] = useState("")
	const [address, setAddress] = useState("")
	const [churchId, setChurchId] = useState("")
	const [description, setDescription] = useState("")
	const [logoUrl, setLogoUrl] = useState<File | null>(null)

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setLogoUrl(file)
		}
	}

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen)
		if (nextOpen) onOpen?.()
	}

	const resetForm = () => {
		setName("")
		setSlug("")
		setAddress("")
		setChurchId("")
		setDescription("")
		setLogoUrl(null)
	}

	const handleSubmit = async () => {
		if (!name.trim() || !churchId.trim()) {
			alert(t("church.create.validation"))
			return
		}

		setSubmitting(true)
		try {
			const formData = new FormData()
			formData.append('name', name.trim())
			formData.append('slug', slug.trim())
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

			resetForm()
			setOpen(false)
			onSuccess?.()  // ← notifica o pai para atualizar a lista
			alert(t("church.create.success"))
		} catch (error) {
			alert(error instanceof Error ? error.message : t("church.create.errors.create"))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger
				asChild
				className="bg-[#FFDEA5] text-[#261900] w-56 rounded-2xl px-6 py-4 mt-8 hover:cursor-pointer"
			>
				<Button variant="outline">{t("church.create.title")}</Button>
			</DialogTrigger>

			<DialogContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-3xl max-h-[90vh] p-6 overflow-auto">
				<DialogHeader>
					<DialogTitle>{t("church.create.title")}</DialogTitle>
					<DialogDescription>
						{t("church.create.description")}
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col">
						<Label htmlFor="church-name" className="mb-2">{t("church.create.fields.name")}</Label>
						<Input
							id="church-name"
							placeholder={t("church.create.placeholders.name")}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

				

					<div className="flex flex-col">
						<Label htmlFor="church-address" className="mb-2">{t("church.create.fields.address")}</Label>
						<Input
							id="church-address"
							placeholder={t("church.create.placeholders.address")}
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</div>

					<div className="flex flex-col">
						<Label htmlFor="churchId" className="mb-2">{t("church.create.fields.church")}</Label>
						<OrganizatioSelect
							id="churchId"
							name="churchId"
							churches={churches}
							loading={loadingChurches}
							onChange={(value) => setChurchId(value)}  // ← isso já resolve
						/>
					</div>

					<div className="flex flex-col">
						<Label htmlFor="logo" className="mb-2">{t("church.create.fields.logo")}</Label>
						<input
							id="logo"
							type="file"
							accept="image/*"
							onChange={handleLogoChange}
							className="mt-2"
						/>
						{logoUrl && (
							<img
								src={URL.createObjectURL(logoUrl)}
								alt="preview"
								className="mt-2 h-20 w-20 object-cover rounded"
							/>
						)}
					</div>

					<div className="md:col-span-2">
						<Label htmlFor="description" className="mb-2">{t("church.create.fields.description")}</Label>
						<Textarea
							id="description"
							placeholder={t("church.create.placeholders.description")}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>

				<DialogFooter className="w-full">
					<DialogClose asChild>
						<Button variant="outline" onClick={resetForm}>{t("common.cancel")}</Button>
					</DialogClose>
					<Button
						type="button"
						className="bg-[#1E3A8A]"
						disabled={submitting}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							console.log("clicou salvar", { name, churchId })
							handleSubmit()
						}}
					>
						{submitting ? t("common.saving") : t("common.saveChanges")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
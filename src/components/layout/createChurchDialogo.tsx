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

			alert("Preencha o nome e selecione a igreja.")
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
				throw new Error(errorText || "Erro ao criar organização")
			}

			resetForm()
			setOpen(false)
			onSuccess?.()  // ← notifica o pai para atualizar a lista
			alert("Organização criada com sucesso!")
		} catch (error) {
			alert(error instanceof Error ? error.message : "Erro ao criar organização")
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
				<Button variant="outline">Criar Igreja</Button>
			</DialogTrigger>

			<DialogContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-3xl max-h-[90vh] p-6 overflow-auto">
				<DialogHeader>
					<DialogTitle>Criar Igreja</DialogTitle>
					<DialogDescription>
						Preencha os detalhes da sua igreja aqui. Clique em salvar quando terminar.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col">
						<Label htmlFor="church-name" className="mb-2">Nome da igreja</Label>
						<Input
							id="church-name"
							placeholder="Ex: Igreja Vida"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="flex flex-col">
						<Label htmlFor="organization-slug" className="mb-2">Slug da organização</Label>
						<Input
							id="organization-slug"
							placeholder="ex: igreja-vida"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
						/>
					</div>

					<div className="flex flex-col">
						<Label htmlFor="church-address" className="mb-2">Endereço</Label>
						<Input
							id="church-address"
							placeholder="Cidade, Estado"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</div>

					<div className="flex flex-col">
						<Label htmlFor="churchId" className="mb-2">Igreja</Label>
						<OrganizatioSelect
							id="churchId"
							name="churchId"
							churches={churches}
							loading={loadingChurches}
							onChange={(value) => setChurchId(value)}  // ← isso já resolve
						/>
					</div>

					<div className="flex flex-col">
						<Label htmlFor="logo" className="mb-2">Foto da igreja / Logo</Label>
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
						<Label htmlFor="description" className="mb-2">Descrição da igreja</Label>
						<Textarea
							id="description"
							placeholder="Uma breve descrição da igreja"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>

				<DialogFooter className="w-full">
					<DialogClose asChild>
						<Button variant="outline" onClick={resetForm}>Cancelar</Button>
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
						{submitting ? "Salvando..." : "Salvar as alterações"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
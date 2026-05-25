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
import { api } from "@/lib/api"

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
	const [logoPreview, setLogoPreview] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	// Campos controlados
	const [name, setName] = useState("")
	const [slug, setSlug] = useState("")
	const [address, setAddress] = useState("")
	const [churchId, setChurchId] = useState("")
	const [description, setDescription] = useState("")
	const [logoUrl, setLogoUrl] = useState("")

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setLogoPreview(URL.createObjectURL(file))
			// Se quiser upload real, faça aqui e salve a URL retornada em setLogoUrl(url)
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
		setLogoUrl("")
		setLogoPreview(null)
	}

	const handleSubmit = async () => {
		if (!name.trim() || !churchId.trim()) {

			alert("Preencha o nome e selecione a igreja.")
			return
		}

		setSubmitting(true)
		try {
			await api.post("/organizations", {
				name: name.trim(),
				slug: slug.trim() || undefined,
				churchId: churchId.trim(),
				address: address.trim() || undefined,
				description: description.trim() || undefined,
				logoUrl: logoUrl.trim() || undefined,
			})
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

			{/* ✅ form removido daqui — botão usa onClick diretamente */}
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
						{logoPreview && (
							<img
								src={logoPreview}
								alt="preview"
								className="mt-2 h-20 w-20 object-cover rounded"
							/>
						)}
					</div>

					<div className="flex flex-col">
						<Label htmlFor="logoUrl" className="mb-2">URL do logo (opcional)</Label>
						<Input
							id="logoUrl"
							placeholder="https://..."
							value={logoUrl}
							onChange={(e) => setLogoUrl(e.target.value)}
						/>
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
							console.log("clicou salvar", { name, churchId }) // ← ver no console
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
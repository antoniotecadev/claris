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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import OrganizatioSelect from "./organizatioSelect"
import { useState } from "react"

export function DialogDemo() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    // incluir arquivo selecionado (se houver)
    if (logoFile) formData.set("logo", logoFile)
    const payload: Record<string, any> = {}
    formData.forEach((v, k) => {
      payload[k] = v
    })
    // por enquanto, apenas logar os dados
    console.log("Criar Igreja payload:", payload)
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild className="bg-[#FFDEA5] text-[#261900] w-56 rounded-2xl px-6 py-4 mt-8 hover:cursor-pointer">
          <Button variant="outline" >Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-3xl max-h-[90vh] p-6 overflow-auto">
          <DialogHeader>
            <DialogTitle>Criar Igreja</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua igreja aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[680px]">
            <div className="flex flex-col">
              <Label htmlFor="church-name">Nome da igreja</Label>
              <Input id="church-name" name="name" placeholder="Ex: Igreja Vida" className="max-w-full" />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="church-location">Localização</Label>
              <Input id="church-location" name="location" placeholder="Cidade, Estado" className="max-w-full" />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="organization">Organização</Label>
              <OrganizatioSelect id="organization" name="organization" />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="logo">Foto da igreja / Logo</Label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="mt-2"
              />
              {logoPreview ? (
                <img src={logoPreview} alt="preview" className="mt-2 h-20 w-20 object-cover rounded" />
              ) : null}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição da igreja</Label>
              <Textarea id="description" name="description" placeholder="Uma breve descrição da igreja" />
            </div>
          </div>
          <DialogFooter className="w-110">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" className="bg-[#1E3A8A] ">Salvar as alterações</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

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

export function DialogDemo() {
  return (
    <Dialog >
      <form>
        <DialogTrigger asChild className="bg-[#FFDEA5] text-[#261900] w-60 rounded-2xl px-9 py-6 mt-12 hover:cursor-pointer">
          <Button variant="outline" >Criar igreja</Button>
        </DialogTrigger>
        <DialogContent className="w-130 sm:max-w-7xl md:max-w-6xl lg:max-w-7xl max-h-[90vh] p-8 ">
          <DialogHeader>
            <DialogTitle>Criar Igreja</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua igreja aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="w-120">
            <Field className="w-110">
              <Label htmlFor="name-1">Name da igreja</Label>
              <Input id="name-1"  placeholder="Igreja de cristo" />
            </Field>
            <Field className="w-100">
              <Label >Localização</Label>
              <Input id="local" placeholder="Província, Município e bairro"  />
            </Field>
			<Field className="w-110">
              <Label >Descrição</Label>
              <textarea name="description" id="" placeholder="Descreva sua igreja..." className="w-20 min-h-20 max-h-21 focus:outline-none border border-gray-300] p-1" />
            </Field>
          </FieldGroup>
          <DialogFooter className="w-110">
            <DialogClose  asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-[#1E3A8A] ">Salvar as alterações</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

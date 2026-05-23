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
    <Dialog>
      <form>
        <DialogTrigger asChild className="bg-[#FFDEA5] text-[#261900] w-60 rounded-2xl px-9 py-6 mt-12 hover:cursor-pointer">
          <Button variant="outline" >Criar igreja</Button>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-7xl md:max-w-6xl lg:max-w-7xl max-h-[90vh] p-8 overflow-auto">
          <DialogHeader>
            <DialogTitle>Criar Igreja</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua igreja aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

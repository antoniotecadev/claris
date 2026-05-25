"use client"

export interface ChurchOption {
  id: string
  name: string
}

interface Props {
  id?: string
  name?: string
  churches?: ChurchOption[]
  loading?: boolean
  onChange?: (value: string) => void  // ← adiciona isso
}

export default function OrganizatioSelect({
  id,
  name,
  churches = [],
  loading = false,
  onChange,  // ← adiciona isso
}: Props) {
  return (
    <select
      id={id}
      name={name}
      disabled={loading}
      onChange={(e) => onChange?.(e.target.value)}  // ← adiciona isso
      className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-[#1A1C1C] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] disabled:opacity-50"
    >
      <option value="">
        {loading ? "A carregar..." : "Selecionar organização"}
      </option>
      {churches.map((church) => (
        <option key={church.id} value={church.id}>
          {church.name}
        </option>
      ))}
    </select>
  )
}
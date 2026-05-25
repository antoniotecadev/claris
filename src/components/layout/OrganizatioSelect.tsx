"use client"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

interface Church {
  id: string
  name: string
}

interface ChurchResponse {
  success: boolean
  churches: Church[]
}

interface Props {
  id?: string
  name?: string
  enabled?: boolean
}

export default function OrganizatioSelect({ id, name, enabled = true }: Props) {
  const [churches, setChurches] = useState<Church[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled) return
    setLoading(true)
    api
      .get<ChurchResponse>("/church")
      .then((res) => setChurches(res.churches ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [enabled])

  return (
    <select
      id={id}
      name={name}
      disabled={loading}
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
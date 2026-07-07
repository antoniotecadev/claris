"use client"

import { useMessages } from "@/i18n/messages"

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
  const { t } = useMessages();
  return (
    <select
      id={id}
      name={name}
      disabled={loading}
      onChange={(e) => onChange?.(e.target.value)}  // ← adiciona isso
      className="mt-1 w-full rounded-md border border-zinc-300 dark:border-slate-600 bg-white px-3 py-2 text-sm dark:bg-slate-800 dark:text-[#999999] text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] disabled:opacity-50"
    >
      <option value="">
        {loading ? t("organization.select.loading") : t("organization.select.placeholder")}
      </option>
      {churches.map((church) => (
        <option key={church.id} value={church.id}>
          {church.name}
        </option>
      ))}
    </select>
  )
}
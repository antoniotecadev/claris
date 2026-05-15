// components/layout/SettingsPanel.tsx
"use client";
import { useState, useRef } from "react";
import { X, Camera, Save, LogOut, User, Mail, Calendar, Users } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { api } from "@/lib/api";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const user = useUserStore((state: { user: any; }) => state.user);
  const setUser = useUserStore((state: { setUser: any; }) => state.setUser);
  const logout = useUserStore((state: { logout: any; }) => state.logout);

  const [fields, setFields] = useState({
    displayName: user?.displayName ?? "",
    email: user?.email ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await api.patch(`/users/${user?.id}`, {
        displayName: fields.displayName,
        email: fields.email,
      });
      setUser({ ...user!, displayName: fields.displayName, email: fields.email });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <p className="text-[#002045] font-semibold text-lg">Definições</p>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            <X size={18} className="text-zinc-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-3xl font-bold">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.displayName?.[0]?.toUpperCase() ?? "U"
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-[#FFDEA5] p-1.5 rounded-full shadow">
                <Camera size={14} className="text-[#261900]" />
              </button>
            </div>
            <p className="text-[#002045] font-medium">{user?.displayName}</p>
            <p className="text-[#475F83] text-sm">{user?.email}</p>
          </div>

          {/* Campos */}
          <div className="flex flex-col gap-4">
            <p className="text-[#002045] text-xs font-semibold tracking-widest uppercase">
              Informações pessoais
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-[#43474E] text-sm flex items-center gap-2">
                <User size={14} /> Nome completo
              </label>
              <input
                type="text"
                name="displayName"
                value={fields.displayName}
                onChange={handleChange}
                className="bg-[#F8F9FA] border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#43474E] text-sm flex items-center gap-2">
                <Mail size={14} /> E-mail
              </label>
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                className="bg-[#F8F9FA] border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors"
              />
            </div>
          </div>

          {/* Feedback */}
          {success && (
            <p className="text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-xl">
              ✓ Alterações guardadas com sucesso.
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 font-medium bg-red-50 px-4 py-2 rounded-xl">
              {error}
            </p>
          )}

          {/* Guardar */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#002045] text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2
                       hover:bg-[#003066] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                       disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Save size={16} />
            {saving ? "A guardar..." : "Guardar alterações"}
          </button>
        </div>

        {/* Footer — logout */}
        <div className="px-6 py-5 border-t border-zinc-100">
          <button
            onClick={() => { logout(); window.location.href = "/login"; }}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50
                       rounded-xl px-4 py-3 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Terminar sessão
          </button>
        </div>
      </aside>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
      `}</style>
    </>
  );
}
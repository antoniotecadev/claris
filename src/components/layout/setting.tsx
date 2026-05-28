"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, Camera, Save, LogOut, User,
  Lock, Eye, EyeOff, Calendar, Users,
  Link,
} from "lucide-react";
import { api } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-cookies";
import { useUserStore } from "@/stores/userStore";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MeResponse {
  success: boolean;
  profile: {
    id: string;
    displayName: string;
    email: string;
    avatarUrl?: string;
    gender?: "MALE" | "FEMALE";
    birthDate?: string;
    googleId?: string;
  };
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const user = useUserStore((state: any) => state.user);
  const setUser = useUserStore((state: any) => state.setUser);
  const logout = useUserStore((state: any) => state.logout);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    try {
      console.log("Initiating logout...");
      // 1. apagar cookie no servidor
      await fetch("/api/logout", {
        method: "POST",
      });

      // 2. limpar estado do frontend (Zustand)
      logout();

      <Link href="/login" />
    } catch (err) {
      console.error("Erro no logout", err);
    }
  };

  const [fields, setFields] = useState({
    displayName: "",
    gender: "" as "" | "MALE" | "FEMALE",
    birthDate: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  useEffect(() => {
    async function loadUser() {
      setPasswordSuccess(false);
      try {
        setLoadingUser(true);
        const { profile } = await api.get<MeResponse>("/user/me");
        console.log("Loaded user profile:", profile);
        setUser(profile);
        setFields({
          displayName: profile.displayName ?? "",
          gender: profile.gender ?? "",
          birthDate: profile.birthDate
            ? profile.birthDate.split("T")[0]
            : "",
        });
        setAvatarPreview(profile.avatarUrl ?? null);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar utilizador.");
      } finally {
        setLoadingUser(false);
      }
    }
    if (isOpen) loadUser();
  }, [isOpen, setUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
    setError(null);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("displayName", fields.displayName);
      if (fields.gender) formData.append("gender", fields.gender);
      if (avatarFile) formData.append("avatarUrl", avatarFile);

      // Não passar Content-Type — o browser define multipart/form-data + boundary sozinho
      const token = await getAuthToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message = Array.isArray(errData?.message)
          ? errData.message[0]
          : errData?.message ?? "Erro ao guardar alterações.";
        throw new Error(message);
      }

      const data = await res.json();
      const updatedProfile = data.profile;

      setUser({
        ...user,
        displayName: updatedProfile.displayName,
        gender: updatedProfile.gender,
        birthDate: updatedProfile.birthDate,
        avatarUrl: updatedProfile.avatarUrl,
      });

      setAvatarFile(null);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao guardar alterações."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handlePasswordSave = async () => {
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordError("As passwords não coincidem.");
      return;
    }
    if (passwordFields.newPassword.length < 6) {
      setPasswordError("A nova password deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await api.patch("/user/me/password", {
        currentPassword: passwordFields.currentPassword,
        newPassword: passwordFields.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Erro ao alterar password."
      );
    }
  };

  if (!isOpen) return null;

  const initials = user?.displayName?.[0]?.toUpperCase() ?? "U";

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

        {/* Tabs */}
        <div className="flex border-b border-zinc-100 px-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "profile"
                ? "border-[#002045] text-[#002045]"
                : "border-transparent text-[#475F83] hover:text-[#002045]"
              }`}
          >
            Perfil
          </button>
          {!user?.googleId && (
            <button
              onClick={() => setActiveTab("password")}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "password"
                  ? "border-[#002045] text-[#002045]"
                  : "border-transparent text-[#475F83] hover:text-[#002045]"
                }`}
            >
              Password
            </button>)}
        </div>

        {/* Loading */}
        {loadingUser ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#475F83] animate-pulse">Carregando utilizador...</p>
          </div>
        ) : activeTab === "profile" ? (
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-[#FFDEA5] p-1.5 rounded-full shadow hover:bg-[#ffd080] transition-colors"
                >
                  <Camera size={14} className="text-[#261900]" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-[#002045] font-medium">{user?.displayName}</p>
              <p className="text-[#475F83] text-sm">{user?.email}</p>
            </div>

            {/* Campos */}
            <div className="flex flex-col gap-4">
              <p className="text-[#002045] text-xs font-semibold tracking-widest uppercase">
                Informações pessoais
              </p>

              {/* Nome */}
              <div className="flex flex-col gap-1">
                <label className="text-[#43474E] text-sm flex items-center gap-2">
                  <User size={14} />
                  Nome completo
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={fields.displayName}
                  onChange={handleChange}
                  className="bg-[#F8F9FA] border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors"
                />
              </div>

              {/* Género */}
              <div className="flex flex-col gap-1">
                <label className="text-[#43474E] text-sm flex items-center gap-2">
                  <Users size={14} />
                  Género
                </label>
                <select
                  name="gender"
                  value={fields.gender}
                  onChange={handleChange}
                  className="bg-[#F8F9FA] border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors"
                >
                  <option value="">Selecionar</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                </select>
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
              className="bg-[#002045] text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-[#003066] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <Save size={16} />
              {saving ? "A guardar..." : "Guardar alterações"}
            </button>
          </div>

        ) : (
          /* Tab Password */

          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-[#002045] text-xs font-semibold tracking-widest uppercase">
                Alterar password
              </p>

              {/* Password atual */}
              <div className="flex flex-col gap-1">
                <label className="text-[#43474E] text-sm flex items-center gap-2">
                  <Lock size={14} />
                  Password atual
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordFields.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nova password */}
              <div className="flex flex-col gap-1">
                <label className="text-[#43474E] text-sm flex items-center gap-2">
                  <Lock size={14} />
                  Nova password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordFields.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirmar password */}
              <div className="flex flex-col gap-1">
                <label className="text-[#43474E] text-sm flex items-center gap-2">
                  <Lock size={14} />
                  Confirmar nova password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordFields.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Força da password */}
            {passwordFields.newPassword && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = Math.min(
                      Math.floor(passwordFields.newPassword.length / 3),
                      4
                    );
                    return (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${level <= strength
                            ? strength <= 1
                              ? "bg-red-400"
                              : strength <= 2
                                ? "bg-yellow-400"
                                : strength <= 3
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                            : "bg-zinc-200"
                          }`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-[#475F83]">
                  {passwordFields.newPassword.length < 4
                    ? "Fraca"
                    : passwordFields.newPassword.length < 7
                      ? "Razoável"
                      : passwordFields.newPassword.length < 10
                        ? "Boa"
                        : "Forte"}
                </p>
              </div>
            )}



            {/* Feedback */}
            {passwordSuccess && (
              <p className="text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-xl">
                ✓ Password alterada com sucesso.
              </p>
            )}
            {passwordError && (
              <p className="text-sm text-red-600 font-medium bg-red-50 px-4 py-2 rounded-xl">
                {passwordError}
              </p>
            )}

            <button
              onClick={handlePasswordSave}
              disabled={passwordSuccess}
              className="bg-[#002045] text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2  "
            >
              <Lock size={16} />
              Alterar password
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-5 border-t border-zinc-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-xl px-4 py-3 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Terminar sessão
          </button>
        </div>
      </aside>
    </>
  );
}
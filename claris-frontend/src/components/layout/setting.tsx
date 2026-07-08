"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, X, Camera, Save, LogOut, User,
  Lock, Eye, EyeOff, Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";
import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";
import { normalizeMediaUrl } from "@/lib/media-url";

interface SettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: "drawer" | "page";
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

type AuthTokenResponse = {
  token?: string | null;
};

async function getClientAuthToken() {
  const response = await fetch("/api/auth-token", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as AuthTokenResponse;
  return data.token ?? null;
}

export default function SettingsPanel({
  isOpen = false,
  onClose,
  variant = "drawer",
}: SettingsPanelProps) {
  const { locale, t } = useMessages();
  const router = useRouter();
  const isPage = variant === "page";
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const cancelDeleteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showDeleteConfirm) {
      return;
    }

    cancelDeleteButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDeleteConfirm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDeleteConfirm]);

  useEffect(() => {
    if (isPage || !isOpen) {
      return;
    }

    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPage, onClose]);

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);

      // eliminar conta
      await api.delete("/user/me");

      // apagar cookie httpOnly
      await fetch("/api/logout", {
        method: "POST",
      });

      // limpar Zustand
      logout();

      // redirect
      window.location.href = addLocaleToPathname("/login", locale);
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : t("settings.errors.deleteAccount")
      );
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = async () => {
    try {
      //console.log("Initiating logout...");
      // 1. apagar cookie no servidor
      await fetch("/api/logout", {
        method: "POST",
      });

      // 2. limpar estado do frontend (Zustand)
      logout();
      window.location.href = addLocaleToPathname("/login", locale);
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
  const avatarPreviewRef = useRef<string | null>(null);

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
       // console.log("Loaded user profile:", profile);
        setUser(profile);
        setFields({
          displayName: profile.displayName ?? "",
          gender: profile.gender ?? "",
          birthDate: profile.birthDate
            ? profile.birthDate.split("T")[0]
            : "",
        });
        setAvatarPreview(normalizeMediaUrl(profile.avatarUrl) ?? null);
      } catch (err) {
        console.error(err);
        setError(t("settings.errors.loadUser"));
      } finally {
        setLoadingUser(false);
      }
    }
    if (isPage || isOpen) loadUser();
  }, [isOpen, isPage, setUser, t]);

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
    // revoke previous preview if exists
    if (avatarPreviewRef.current) {
      try {
        URL.revokeObjectURL(avatarPreviewRef.current);
      } catch {
        // ignore
      }
      avatarPreviewRef.current = null;
    }
    const newUrl = URL.createObjectURL(file);
    avatarPreviewRef.current = newUrl;
    setAvatarPreview(newUrl);
  };

  useEffect(() => {
    return () => {
      if (avatarPreviewRef.current) {
        try {
          URL.revokeObjectURL(avatarPreviewRef.current);
        } catch {
          // ignore
        }
        avatarPreviewRef.current = null;
      }
    };
  }, []);

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
      const token = await getClientAuthToken();
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message = Array.isArray(errData?.message)
          ? errData.message[0]
          : errData?.message ?? t("settings.errors.saveProfile");
        throw new Error(message);
      }

      const data = await res.json();
      const updatedProfile = data.profile ?? data.result?.profile ?? data.user ?? data.result?.user;
      const nextAvatarUrl = normalizeMediaUrl(updatedProfile.avatarUrl);

      setUser({
        ...user,
        displayName: updatedProfile.displayName,
        gender: updatedProfile.gender,
        birthDate: updatedProfile.birthDate,
        avatarUrl: nextAvatarUrl,
      });

      setAvatarPreview(nextAvatarUrl ?? null);
      setAvatarFile(null);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("settings.errors.saveProfile")
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
      setPasswordError(t("settings.errors.passwordMismatch"));
      return;
    }
    if (passwordFields.newPassword.length < 6) {
      setPasswordError(t("settings.errors.passwordLength"));
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
        err instanceof Error ? err.message : t("settings.errors.passwordUpdate")
      );
    }
  };

  if (!isPage && !isOpen) return null;

  const initials = user?.displayName?.[0]?.toUpperCase() ?? "U";
  const shellClassName = isPage
    ? "min-h-screen  bg-[#F7F9FC] text-[#002045] dark:bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)]"
    : "fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in dark:bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)]";
  const contentClassName = isPage
    ? "mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8 "
    : "flex h-full flex-col";
  const bodyClassName = isPage
    ? "flex-1 rounded-2xl bg-white shadow-sm ring-1 dark:ring-slate-800 ring-slate-200 dark:bg-slate-900"
    : "flex min-h-0 flex-1 flex-col dark:bg-slate-900";

  return (
    <>
      {/* Overlay */}
      {!isPage && (
        <div
          className="fixed inset-0    bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <section
        ref={panelRef}
        className={shellClassName}
        tabIndex={isPage ? undefined : -1}
        role={isPage ? undefined : "dialog"}
        aria-modal={isPage ? undefined : true}
        aria-labelledby={isPage ? undefined : "settings-title"}
      >
        <div className={contentClassName}>
          <div className={bodyClassName}>

        {/* Header */}
        <div className="flex items-center  justify-between px-6 py-5 border-b dark:border-slate-800 border-zinc-100">
          <h2 id="settings-title" className="text-brand-primary dark:text-slate-50 font-semibold text-lg">
            {t("settings.title")}
          </h2>
          <button
            onClick={() => (isPage ? router.back() : onClose?.())}
            className="p-2 rounded-xl dark:hover:bg-slate-800 hover:bg-zinc-100 transition-colors"
            aria-label={isPage ? "Voltar" : "Fechar"}
          >
            {isPage ? (
              <ArrowLeft size={18} className="dark:text-slate-50 text-zinc-500" />
            ) : (
              <X size={18} className="dark:text-slate-50 text-zinc-500" />
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-slate-800 border-zinc-100 px-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "profile"
              ? "border-brand-primary dark:border-slate-50 dark:text-slate-50 text-brand-primary"
              : "border-transparent text-brand-muted dark:text-slate-500 dark:hover:text-slate-800 hover:text-brand-primary"
              }`}
          >
            {t("settings.tabs.profile")}
          </button>
          {!user?.googleId && (
            <button
              onClick={() => setActiveTab("password")}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "password"
                ? "border-brand-primary dark:border-slate-50 dark:text-slate-50 text-brand-primary"
                : "border-transparent text-brand-muted dark:text-slate-500 dark:hover:text-slate-800 hover:text-brand-primary"
                }`}
            >
              {t("settings.tabs.password")}
            </button>)}
        </div>

        {/* Loading */}
        {loadingUser ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-brand-muted animate-pulse">{t("settings.loading")}</p>
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
                  type="button"
                  onClick={handleAvatarClick}
                  aria-label={t("settings.profile.changeAvatar")}
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
              <p className="text-brand-primary dark:text-slate-50 font-medium">{user?.displayName}</p>
              <p className="text-brand-muted dark:text-slate-300 text-sm">{user?.email}</p>
            </div>

            {/* Campos */}
            <div className="flex flex-col gap-4">
              <p className="text-brand-primary dark:text-slate-50 text-xs font-semibold tracking-widest uppercase">
                {t("settings.profile.sectionTitle")}
              </p>

              {/* Nome */}
              <div className="flex flex-col gap-1">
                <label className="text-[#43474E] dark:text-slate-300 text-sm flex items-center gap-2">
                  <User size={14} />
                  {t("settings.profile.name")}
                </label>
                <input
                  type="text"
                  name="displayName"
                  placeholder="Nome"
                  value={fields.displayName}
                  onChange={handleChange}
                  className="bg-[#F8F9FA]  dark:bg-slate-900 dark:text-slate-300 dark:border-slate-300 border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors"
                />
              </div>

              {/* Género */}
              <div className="flex flex-col gap-1">
                <label className="text-[#43474E] dark:text-slate-300 text-sm flex items-center gap-2">
                  <Users size={14} />
                  {t("settings.profile.gender")}
                </label>
                <select
                  name="gender"
                  value={fields.gender}
                  onChange={handleChange}
                  className="bg-[#F8F9FA] dark:bg-slate-900 dark:text-slate-300 dark:border-slate-300 border border-zinc-200 rounded-xl px-4 py-3 text-[#1A1C1C] focus:outline-none focus:border-[#1E3A8A] transition-colors"
                >
                  <option value="">{t("settings.profile.genderSelect")}</option>
                  <option value="MALE">{t("settings.profile.genderMale")}</option>
                  <option value="FEMALE">{t("settings.profile.genderFemale")}</option>
                </select>
              </div>
            </div>

            {/* Feedback */}
            {success && (
              <p className="text-sm text-green-600 font-medium dark:bg-slate-900 bg-green-50 px-4 py-2 rounded-xl">
                ✓ {t("settings.profile.saved")}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:bg-slate-900 font-medium bg-red-50 px-4 py-2 rounded-xl">
                {error}
              </p>
            )}

            {/* Guardar */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-primary text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-[#003066] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <Save size={16} />
              {saving ? t("common.saving") : t("common.saveChanges")}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 text-red-700 dark:hover:bg-red-300 hover:bg-red-100 rounded-xl px-4 py-3 transition-colors text-sm font-medium mt-2 border-solid border-red-700 border-2"
            >
              {t("settings.delete")}
            </button>
          </div>

        ) : (
          /* Tab Password */

          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase">
                {t("settings.password.sectionTitle")}
              </p>

              {/* Password atual */}
              <div className="flex flex-col gap-1">
                <label className="text-[#43474E] text-sm flex items-center gap-2">
                  <Lock size={14} />
                  {t("settings.password.current")}
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
                    aria-label={showPasswords.current ? t("auth.login.passwordHide") : t("auth.login.passwordShow")}
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
                  {t("settings.password.new")}
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
                    aria-label={showPasswords.new ? t("auth.login.passwordHide") : t("auth.login.passwordShow")}
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
                  {t("settings.password.confirm")}
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
                    aria-label={showPasswords.confirm ? t("auth.login.passwordHide") : t("auth.login.passwordShow")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {passwordSuccess && (
              <p className="text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-xl">
                ✓ {t("settings.password.saved")}
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
              className="bg-brand-primary text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2  "
            >
              <Lock size={16} />
              {t("settings.password.change")}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-5 border-t dark:border-slate-800 border-zinc-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 dark:hover:bg-red-300 hover:bg-red-50 rounded-xl px-4 py-3 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            {t("settings.logout")}
          </button>
        
        </div>


        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-account-title"
              aria-describedby="delete-account-description"
              tabIndex={-1}
              className="bg-white rounded-2xl dark:bg-slate-900 p-6 w-full max-w-sm shadow-2xl"
            >
              <h2 id="delete-account-title" className="text-lg font-semibold dark:text-slate-50 text-brand-primary">
                {t("settings.deleteConfirm.title")}
              </h2>

              <p id="delete-account-description" className="text-sm dark:text-slate-300 text-brand-muted mt-2">
                {t("settings.deleteConfirm.description")}
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  ref={cancelDeleteButtonRef}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-zinc-200 rounded-xl py-3 text-sm dark:bg-slate-800 font-medium hover:bg-zinc-50"
                >
                  {t("common.cancel")}
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="flex-1 bg-red-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-red-700 disabled:opacity-60"
                >
                  {deletingAccount
                    ? t("settings.deleteConfirm.deleting")
                    : t("settings.deleteConfirm.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </section>
    </>
  );
}

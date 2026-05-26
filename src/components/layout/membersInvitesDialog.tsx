"use client";

import { useState } from "react";
import { Check, X, Mail, UserCheck, Mail as MailIcon, ArrowRight } from "lucide-react";

interface Member {
  id: number;
  name: string;
  description: string;
  avatar?: string;
}

const initialPendingMembers: Member[] = [
  {
    id: 1,
    name: "André Santos",
    description: "Solicitou acesso via App",
    avatar: "https://i.pravatar.cc/100?img=10",
  },
  {
    id: 2,
    name: "Lúcia Oliveira",
    description: "Convite por indicação",
    avatar: "https://i.pravatar.cc/100?img=11",
  },
];

const initialInvitedMembers: Member[] = [
  {
    id: 1,
    name: "Carlos Silva",
    description: "Convite enviado por Email",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 2,
    name: "Maria João",
    description: "Convite enviado pelo sistema",
    avatar: "https://i.pravatar.cc/100?img=13",
  },
];

interface MembersInvitesDialogProps {
  onClose: () => void;
}

export default function MembersInvitesDialog({ onClose }: MembersInvitesDialogProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "invited">("pending");
  const [pendingMembers, setPendingMembers] = useState(initialPendingMembers);
  const [invitedMembers, setInvitedMembers] = useState(initialInvitedMembers);
  const [email, setEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const approveMember = (id: number) => {
    setPendingMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const rejectMember = (id: number) => {
    setPendingMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const cancelInvite = (id: number) => {
    setInvitedMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleInviteEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setInviteSent(true);
      setEmail("");
      setTimeout(() => setInviteSent(false), 2000);
    }
  };

  const currentMembers = activeTab === "pending" ? pendingMembers : invitedMembers;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition-all relative ${
            activeTab === "pending"
              ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <UserCheck size={18} />
          Pendentes ({pendingMembers.length})
        </button>

        <button
          onClick={() => setActiveTab("invited")}
          className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition-all ${
            activeTab === "invited"
              ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Mail size={18} />
          Convidados ({invitedMembers.length})
        </button>
      </div>

      {/* Members List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {currentMembers.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 text-sm">
              {activeTab === "pending"
                ? "Nenhuma solicitação pendente"
                : "Nenhum convite enviado"}
            </p>
          </div>
        ) : (
          currentMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              {/* Member Info */}
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={member.avatar || `https://i.pravatar.cc/100?img=${member.id}`}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-500">{member.description}</p>
                </div>
              </div>

              {/* Actions */}
              {activeTab === "pending" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => rejectMember(member.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                    title="Rejeitar"
                  >
                    <X size={18} />
                  </button>
                  <button
                    onClick={() => approveMember(member.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                    title="Aprovar"
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => cancelInvite(member.id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-6">
        {/* Invite by Email Section */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Mail size={18} className="text-[#1E3A8A]" />
            Convidar por Email
          </p>

          <form onSubmit={handleInviteEmail} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-sm"
              required
            />
            <button
              type="submit"
              disabled={inviteSent}
              className="flex items-center gap-2 bg-linear-to-r from-[#1E3A8A] to-[#002045] hover:from-[#1E3A8A]/90 hover:to-[#002045]/90 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
              <span className="text-sm">{inviteSent ? "Enviado!" : "Enviar"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

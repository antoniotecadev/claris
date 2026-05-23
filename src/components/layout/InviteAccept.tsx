"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

interface Member {
  id: number;
  name: string;
  description: string;
}

const initialPendingMembers: Member[] = [
  {
    id: 1,
    name: "André Santos",
    description: "Solicitou acesso via App",
  },
  {
    id: 2,
    name: "Lúcia Oliveira",
    description: "Convite por indicação",
  },
];

const initialInvitedMembers: Member[] = [
  {
    id: 1,
    name: "Carlos Silva",
    description: "Convite enviado por Email",
  },
  {
    id: 2,
    name: "Maria João",
    description: "Convite enviado pelo sistema",
  },
];

export default function MembersInvitesCard() {
  const [activeTab, setActiveTab] = useState<
    "pending" | "invited"
  >("pending");

  const [pendingMembers] = useState(
    initialPendingMembers
  );

  const [invitedMembers, setInvitedMembers] =
    useState(initialInvitedMembers);

  const cancelInvite = (id: number) => {
    setInvitedMembers((prev) =>
      prev.filter((member) => member.id !== id)
    );
  };

  const currentMembers =
    activeTab === "pending"
      ? pendingMembers
      : invitedMembers;

  return (
    <div className="w-[320px] rounded-[28px] bg-white p-8 mt-8">
      {/* Title */}
      <h2 className="text-[20px] font-bold text-[#0A2B57]">
        Membros & Convites
      </h2>

      {/* Tabs */}
      <div className="mt-7 flex items-center gap-5 text-sm">
        <button
          onClick={() => setActiveTab("pending")}
          className={`
            relative pb-3 font-semibold
            ${
              activeTab === "pending"
                ? "text-[#0A2B57]"
                : "text-[#5F6470]"
            }
          `}
        >
          Pendentes ({pendingMembers.length})

          {activeTab === "pending" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#0A2B57]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("invited")}
          className={`
            relative pb-3 font-semibold
            ${
              activeTab === "invited"
                ? "text-[#0A2B57]"
                : "text-[#5F6470]"
            }
          `}
        >
          Convidados ({invitedMembers.length})

          {activeTab === "invited" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#0A2B57]" />
          )}
        </button>
      </div>

      <div className="mt-2 border-b border-[#ECECEC]" />

      {/* Members */}
      <div className="mt-6 space-y-4">
        {currentMembers.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl bg-[#F4F4F4] p-4"
          >
            <div className="flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#203A35] text-white">
                  📄
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold text-[#0A2B57]">
                    {member.name}
                  </h3>

                  <p className="text-[13px] text-[#7B7F87]">
                    {member.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {activeTab === "pending" ? (
                <div className="flex items-center gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5E4E4] text-[#D86A6A]">
                    <X size={16} />
                  </button>

                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062C5B] text-white">
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    cancelInvite(member.id)
                  }
                  className="
                    rounded-xl
                    bg-[#F5E4E4]
                    px-4 py-2
                    text-xs
                    font-semibold
                    text-[#D86A6A]
                    transition
                    hover:bg-[#edd4d4]
                  "
                >
                  Cancelar convite
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-8 border-b border-[#ECECEC]" />

      {/* Invite Email */}
      <div>
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[2px] text-[#555]">
          Convidar por Email
        </p>

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="email@exemplo.com"
            className="
              h-10 flex-1 rounded-xl
              bg-[#EFEFEF]
              px-4 text-sm
              outline-none
              placeholder:text-[#A5A5A5]
			  w-8
            "
          />

          <button
            className="
              rounded-xl bg-[#062C5B]
              px-6 text-[8px]
              font-bold uppercase
              tracking-[1px]
              text-white
            "
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
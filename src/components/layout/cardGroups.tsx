import { MoreVertical, LucideIcon } from "lucide-react";

interface MissionCardProps {
  title: string;
  activeMembers: number;
  icon: LucideIcon;
  theme?: "light" | "dark" | "blue" | "green";
  members?: string[];
  className?: string;
}

const themes = {
  light: {
    card: "bg-neutral-100 text-black",
    icon: "bg-neutral-200",
    textSecondary: "text-gray-500",
  },
  dark: {
    card: "bg-gray-900 text-white",
    icon: "bg-gray-800",
    textSecondary: "text-gray-400",
  },
  blue: {
    card: "bg-blue-50 text-black",
    icon: "bg-blue-100",
    textSecondary: "text-gray-500",
  },
  green: {
    card: "bg-green-50 text-black",
    icon: "bg-green-100",
    textSecondary: "text-gray-500",
  },
} as const;

export default function MissionCard({
  title,
  activeMembers,
  icon: Icon,
  theme = "light",
  members = [],
  className,
}: MissionCardProps) {
  const selectedTheme = themes[theme];

  return (
    <div
      className={`
        w-80
        rounded-[28px]
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:scale-[1.02]
        ${selectedTheme.card}
        ${className ?? ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className={`
            flex h-12 w-12
            items-center justify-center
            rounded-2xl
            ${selectedTheme.icon}
          `}
        >
          <Icon size={20} />
        </div>

        <button className="text-gray-500 transition hover:text-gray-700">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-[14px] font-bold leading-tight">
          {title}
        </h3>

        <p
          className={`mt-2 text-[10px] ${selectedTheme.textSecondary}`}
        >
          {activeMembers} membros ativos
        </p>
      </div>

      {/* Members */}
      <div className="mt-5 flex items-center">
        {members.slice(0, 3).map((member, index) => (
          <div
            key={index}
            className={`
              h-9 w-9 overflow-hidden rounded-full
              border-2 border-white
              ${index !== 0 ? "-ml-2" : ""}
            `}
          >
            <img
              src={member}
              alt={`member-${index}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        {members.length > 3 && (
          <div
            className="
              -ml-2 flex h-9 w-9
              items-center justify-center
              rounded-full bg-yellow-400
              text-xs font-bold text-black
            "
          >
            +{members.length - 3}
          </div>
        )}
      </div>
    </div>
  );
}
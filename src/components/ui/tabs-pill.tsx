import { ReactNode } from "react";

export interface TabItem<T extends string> {
  key: T;
  label: string;
  count?: number;
  icon?: ReactNode;
}

interface TabsPillProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (key: T) => void;
}

export function TabsPill<T extends string>({ tabs, activeTab, onChange }: TabsPillProps<T>) {
  return (
    <div className="flex gap-1.5 rounded-2xl dark:bg-slate-900 bg-brand-bg p-1 ring-1 dark:ring-slate-800 ring-slate-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-200
              ${isActive
                ? "bg-white dark:bg-slate-800 text-brand-primary dark:text-slate-50 shadow-sm ring-1 dark:ring-slate-700 ring-slate-200"
                : "text-brand-muted dark:text-slate-300 hover:text-brand-primary"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold
                  ${isActive
                    ? "bg-brand-primary dark:bg-slate-300 text-white dark:text-slate-800"
                    : "bg-slate-200 dark:bg-slate-800 text-brand-muted dark:text-slate-300"
                  }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

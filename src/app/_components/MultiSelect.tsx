"use client";

import { useState, useRef, useEffect, useMemo } from "react";

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Sélectionner...",
  className = "",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) || opt.description?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const toggleOption = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange(newSelected);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full font-body ${className}`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-surface-container-low border border-white/5 rounded-xl px-4 py-3 cursor-pointer flex items-center justify-between transition-all hover:bg-surface-container group ${
          isOpen ? "ring-2 ring-primary/50 border-primary" : ""
        }`}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 overflow-hidden">
          {selected.length > 0 ? (
            selected.map((id) => {
              const opt = options.find((o) => o.id === id);
              return (
                <span
                  key={id}
                  className="bg-primary/20 text-slate-100 text-[12px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"
                >
                  {opt?.label || id}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(id);
                    }}
                    className="hover:scale-125 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[12px] font-black">
                      close
                    </span>
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-on-surface-variant text-sm italic opacity-50">
              {placeholder}
            </span>
          )}
        </div>
        <span
          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-surface-container border border-white/10 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                autoFocus
                type="text"
                className="w-full bg-surface-container-low border-0 focus:ring-0 text-sm py-2 pl-9 pr-4 rounded-xl text-on-surface font-medium placeholder:opacity-40"
                placeholder="Rechercher un scope..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isActive = selected.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className="px-4 py-3 flex items-start gap-3 hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-primary border-primary text-slate-950"
                          : "border-white/20 group-hover:border-primary/50"
                      }`}
                    >
                      {isActive && (
                        <span className="material-symbols-outlined text-[12px] font-black">
                          check
                        </span>
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${isActive ? "text-primary" : "text-on-surface"}`}
                      >
                        {opt.label}
                      </p>
                      {opt.description && (
                        <p className="text-[10px] text-on-surface-variant opacity-60">
                          {opt.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs text-on-surface-variant opacity-40 italic">
                  Aucun résultat
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

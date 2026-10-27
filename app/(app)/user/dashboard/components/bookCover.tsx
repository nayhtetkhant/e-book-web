import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Static class strings so Tailwind can pick them up.
const palettes = [
    "from-teal-600 via-teal-700 to-emerald-900",
    "from-amber-500 via-orange-600 to-rose-700",
    "from-indigo-500 via-violet-600 to-purple-900",
    "from-sky-500 via-blue-600 to-slate-900",
    "from-rose-500 via-pink-600 to-fuchsia-900",
    "from-lime-600 via-green-700 to-teal-900",
    "from-stone-500 via-stone-700 to-neutral-900",
];

export default function BookCover({
    id,
    title,
    className,
    size = "md",
    style,
}: {
    id: number;
    title: string;
    className?: string;
    size?: "sm" | "md";
    style?: CSSProperties;
}) {
    const palette = palettes[Math.abs(id) % palettes.length];

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-gradient-to-br text-white shadow-md ring-1 ring-black/10",
                palette,
                className,
            )}
            style={style}
        >
            {/* Spine */}
            <div className="absolute inset-y-0 left-0 w-2 bg-black/20" />
            <div className="absolute inset-y-0 left-2 w-px bg-white/20" />
            {/* Decorative rings */}
            <div className="absolute -right-8 -top-8 size-24 rounded-full border border-white/15" />
            <div className="absolute -right-4 -top-4 size-16 rounded-full border border-white/10" />

            {size === "md" ? (
                <div className="relative flex h-full flex-col justify-between p-4 pl-6">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                        E-Book
                    </span>
                    <div className="space-y-2">
                        <div className="h-px w-8 bg-white/60" />
                        <p className="line-clamp-3 font-serif text-lg font-semibold leading-snug">
                            {title}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative flex h-full items-end p-1.5 pl-3">
                    <p className="line-clamp-2 font-serif text-[9px] font-semibold leading-tight">
                        {title}
                    </p>
                </div>
            )}
        </div>
    );
}

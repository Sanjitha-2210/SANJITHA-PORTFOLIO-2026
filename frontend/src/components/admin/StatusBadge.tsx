import { ContentStatus } from "@/types";

interface StatusBadgeProps {
  status: ContentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "published":
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{ 
            backgroundColor: "var(--tag-bg)", 
            color: "var(--text-tan)", 
            borderColor: "var(--tag-border)",
            borderWidth: "1px" 
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--text-tan)" }} />
          Published
        </span>
      );
    case "draft":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Draft
        </span>
      );
    case "archived":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface text-text-secondary border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary" />
          Archived
        </span>
      );
    default:
      return null;
  }
}

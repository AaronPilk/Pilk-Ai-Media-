import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {index && <span className="eyebrow opacity-60">{index}</span>}
      <span className="eyebrow">{children}</span>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { LoaderCircle, LucideProps } from "lucide-react";
export default function Loading({
  size = "1rem",
  className,
  ...props
}: LucideProps) {
  return (
    <div className="flex items-center">
      <LoaderCircle
        size={size}
        className={cn("animate-spin", className)}
        {...props}
      />
    </div>
  );
}

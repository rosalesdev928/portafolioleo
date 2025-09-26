import { cn } from "../../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold",
        "bg-gradient-to-b from-emerald-400 to-emerald-500 text-emerald-950 hover:opacity-90",
        className
      )}
      {...props}
    />
  );
}

import { cn } from "../../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: Props) {
  return (
    <button
      className={cn(
        "action-primary",
        className
      )}
      {...props}
    />
  );
}

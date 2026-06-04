import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "action";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({ variant = "secondary", className = "", ...props }: Props) {
  const variantClass = variant === "primary"
    ? "btn btn-primary"
    : variant === "action"
      ? "btn btn-action"
      : "btn btn-secondary";
  return <button className={`${variantClass} ${className}`.trim()} {...props} />;
}

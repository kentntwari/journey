import type { ReactNode, ComponentProps } from "react";

type ButtonProps = {
  children: ReactNode;
  size: "2xs" | "xs" | "small" | "medium" | "large" | "xl";
  variant?: "primary" | "secondary" | "neutral";
} & ComponentProps<"button">;

export default function Button({
  size = "small",
  variant,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${
        variant === "primary"
          ? "bg-global-blue-900 text-white"
          : variant === "neutral"
          ? "bg-white text-global-neutral-grey-1000 border border-global-neutral-grey-500 shadow-sm"
          : "bg-inherit text-global-neutral-grey-1000"
      } ${
        size === "2xs"
          ? "h-[30px]"
          : size === "xs"
          ? "h-[32px]"
          : size === "small"
          ? "h-[36px]"
          : size === "medium"
          ? "h-[40px]"
          : size === "large"
          ? "h-[44px]"
          : size === "xl"
          ? "h-[48px]"
          : "h-fit"
      } px-[14px] w-auto flex items-center justify-center font-medium text-sm rounded-md`}
    >
      {children}
    </button>
  );
}

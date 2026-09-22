import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Self Portrait Studio",
};

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
      {children}
    </div>
  );
}

import { LoginForm } from "./LoginForm";

export const metadata = { title: "Login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm border border-line-dark bg-ink-soft p-8">
        <div className="mb-6 text-center">
          <p className="font-display text-lg font-extrabold tracking-wide text-text-ondark">
            GF MOTORS
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-text-ondark-dim">
            Painel administrativo
          </p>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}

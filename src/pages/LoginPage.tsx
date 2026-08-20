import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <section className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-text-primary">ShopKB</h1>

              <p className="mt-2 text-text-secondary">
                welcome back! sign in
              </p>
            </div>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}

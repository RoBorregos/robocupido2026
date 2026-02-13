import { redirect } from "next/navigation";
import { auth, signIn } from "~/server/auth";
import Header from "../_components/header";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  const { error } = await searchParams;

  if (session) {
    redirect("/questionnaire");
  }

  const showEmailError = error === "AccessDenied";

  return (
    <div className="bg-background-light font-display text-wine relative min-h-screen transition-colors duration-300 overflow-x-hidden">
      {/* Top Navigation */}
      <Header />

      {/* Main Content */}
      <main className="soft-gradient-bg relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-10">
        <div className="relative z-10 w-full max-w-sm">
          <div className="rounded-2xl border border-pink-100 bg-white/40 p-10 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            {/* Logo Section */}
            <div className="heart-glow relative z-0 mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-pink-100 bg-white shadow-lg transition-transform duration-500 hover:scale-105 dark:border-white/10 dark:bg-white/5">
              <svg
                className="text-primary heart-pulse h-12 w-12 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            <h1 className="font-serif text-3xl font-bold tracking-tight text-wine mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="mb-10 text-rose-brown font-medium">
              Inicia sesión con tu cuenta @tec.mx para encontrar tu match ideal
            </p>

            {/* Error Message */}
            {showEmailError && (
              <div className="mb-6 rounded-lg bg-red-100 border border-red-300 p-4 text-red-700">
                <p className="text-sm font-semibold">
                  Solo puedes usar @tec.mx
                </p>
              </div>
            )}

            {/* Google Sign In - Server Action */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/questionnaire" });
              }}
            >
              <button
                type="submit"
                className="bg-primary shadow-primary/20 flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center opacity-40">
        <p className="text-rose-brown text-xs uppercase tracking-widest font-bold">
        </p>
      </footer>
    </div>
  );
}

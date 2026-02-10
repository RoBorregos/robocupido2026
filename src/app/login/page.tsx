import { redirect } from "next/navigation";
import { auth, signIn } from "~/server/auth";
import { Heart } from "lucide-react";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/questionnaire");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500/20 blur-3xl" />
        <div
          className="absolute top-1/4 -right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          {/* Logo */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-purple-600">
            <Heart className="h-8 w-8 text-white" />
          </div>

          <h1 className="mb-2 bg-linear-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
            RoBoCupido
          </h1>
          <p className="mb-8 text-sm text-white/60">
            Inicia sesion con tu cuenta @tec.mx
          </p>

          {/* Google Sign In - Server Action */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/questionnaire" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20"
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
    </div>
  );
}

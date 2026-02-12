import { redirect } from "next/navigation";
import { auth, signOut } from "~/server/auth";
import { Heart, LogOut } from "lucide-react";
import Link from "next/link";

export default async function LogoutPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
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
            Cerrar Sesión
          </h1>
          
          {session.user?.email && (
            <p className="mb-2 text-sm text-white/80">
              {session.user.email}
            </p>
          )}
          
          <p className="mb-8 text-sm text-white/60">
            ¿Deseas cerrar sesión y usar otra cuenta?
          </p>

          {/* Sign Out - Server Action */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-pink-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/25"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </form>

          <Link
            href="/"
            className="mt-4 block text-sm text-white/50 transition-colors hover:text-white/80"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
}

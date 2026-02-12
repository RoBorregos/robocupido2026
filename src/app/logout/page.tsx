import { redirect } from "next/navigation";
import { auth, signOut } from "~/server/auth";
import { Heart, LogOut } from "lucide-react";
import Link from "next/link";
import Header from "../_components/header";
import HeartParticles from "../_components/heartParticles";

export default async function LogoutPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="bg-background-light font-display text-wine relative min-h-screen transition-colors duration-300 overflow-x-hidden">
      {/* Heart Particles Animation Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HeartParticles />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="gradient-bg relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-10">
        <div className="relative z-10 w-full max-w-sm">
          <div className="rounded-2xl border border-pink-100 bg-white/90 p-10 text-center shadow-xl backdrop-blur-xl">
            {/* Logo */}
            <div className="heart-glow relative z-0 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-pink-100 bg-white shadow-lg">
              <Heart className="text-primary h-10 w-10 fill-current" />
            </div>

            <h1 className="text-wine mb-2 text-2xl font-bold">
              Cerrar Sesión
            </h1>
            
            {session.user?.email && (
              <p className="text-wine mb-2 text-sm font-medium">
                {session.user.email}
              </p>
            )}
            
            <p className="text-rose-brown mb-8 text-sm">
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
                className="bg-primary shadow-primary/20 flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </form>

            <Link
              href="/"
              className="text-rose-brown hover:text-wine mt-6 block text-sm transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

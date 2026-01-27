import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import HeartParticles from "./_components/heartParticles";
import Welcome from "./_components/welcome";
import Header from "./_components/header";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="bg-background-light font-display text-wine transition-colors duration-300 min-h-screen relative overflow-x-hidden">
        {/* Heart Particles Animation Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <HeartParticles />
        </div>

        {/* Header/Navbar */}
        <Header session={session} />

        {/* Main Content */}
        <main className="relative z-10">
          <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 text-center soft-gradient-bg pt-20">
            <div className="mb-14 heart-glow relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 animate-pulse"></div>
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-white shadow-[0_20px_50px_rgba(238,43,91,0.15)] border border-primary/10 transition-transform duration-500 hover:scale-110">
                <svg
                  className="h-24 w-24 text-primary fill-current heart-pulse"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
            <div className="max-w-[900px] space-y-8">
              <h1 className="hero-title text-6xl font-extrabold tracking-tight text-wine md:text-8xl">
                RoboCupido
              </h1>
              <p className="mx-auto max-w-[580px] text-lg font-medium text-rose-dust/80">
                By Roborregos
              </p>
              <div className="pt-6">
                <button className="flex min-w-[220px] mx-auto items-center justify-center gap-2 rounded-full bg-primary h-14 px-8 text-sm font-bold text-white shadow-xl shadow-primary/30 transition-all hover:translate-y-[-2px] hover:shadow-2xl active:translate-y-0">
                  Encuentra tu match
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="px-4 py-8 text-center relative z-10">
          <div className="mx-auto max-w-[960px] space-y-6">
            <div className="pt-10 border-t border-primary/5">
              <p className="text-xs font-medium text-rose-dust/80">
                Made with <span className="text-primary">❤️</span> by <span className="text-wine font-bold">Roborregos</span>
              </p>
              <p className="mt-2 text-[10px] text-rose-dust/50">© 2026 Roborregos. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </HydrateClient>
  );
}

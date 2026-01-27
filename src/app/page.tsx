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
            <div className="mb-14 heart-glow">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-2xl shadow-primary/5 border border-primary/5">
                <span className="material-symbols-outlined text-[64px] text-primary select-none fill-1">favorite</span>
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

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
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
          <header className="flex h-16 w-full max-w-[960px] items-center justify-between rounded-full border border-primary/5 bg-white/70 px-8 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full">
                <img src="/black_logo.png" alt="Roborregos Logo" className="h-full w-full object-contain" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-wine">RoboCupido</h2>
            </div>
            <nav className="flex items-center gap-6">
              <div className="flex items-center gap-4 mr-2 border-r border-primary/10 pr-6">
                <a href="https://roborregos.com" target="_blank" rel="noopener noreferrer" className="text-rose-dust hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-[20px]">public</span>
                </a>
                <a href="https://instagram.com/roborregos" target="_blank" rel="noopener noreferrer" className="text-rose-dust hover:text-primary transition-all">
                  <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
              <button className="flex h-10 items-center justify-center rounded-full bg-primary px-6 text-xs font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30 active:scale-95">
                {session ? "Mi Perfil" : "Iniciar Sesión"}
              </button>
            </nav>
          </header>
        </div>

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

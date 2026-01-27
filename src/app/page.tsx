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
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-xs">favorite</span>
              </div>
              <h2 className="text-md font-bold tracking-tight text-primary">RoboCupido</h2>
            </div>
            <nav className="hidden items-center gap-8 md:flex">
              <a className="text-xs font-semibold hover:text-primary transition-colors text-wine/80" href="#">Inicio</a>
              <a className="text-xs font-semibold hover:text-primary transition-colors text-wine/80" href="#sobre-el-evento">Sobre el Evento</a>
              <button className="flex h-9 items-center justify-center rounded-full bg-primary px-5 text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                {session ? "Mi Perfil" : "Iniciar Sesión"}
              </button>
            </nav>
            <button className="md:hidden text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
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
                Conexiones que van más allá de una mirada
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
        <footer className="bg-background-light px-4 py-16 text-center relative z-10">
          <div className="mx-auto max-w-[960px] space-y-12">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                <span className="text-lg font-bold text-wine">RoboCupido</span>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-wider text-rose-dust/70">
                <a className="hover:text-primary" href="#">Privacidad</a>
                <a className="hover:text-primary" href="#">Términos</a>
                <a className="hover:text-primary" href="#">Contacto</a>
              </div>
              <div className="flex gap-4">
                <a className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 text-rose-dust/60 hover:bg-primary/5 hover:text-primary transition-all" href="#">
                  <span className="material-symbols-outlined text-lg">share</span>
                </a>
                <a className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 text-rose-dust/60 hover:bg-primary/5 hover:text-primary transition-all" href="#">
                  <span className="material-symbols-outlined text-lg">public</span>
                </a>
              </div>
            </div>
            <div className="pt-10 border-t border-primary/5">
              <p className="text-xs font-medium text-rose-dust/80">
                Made with <span className="text-primary">❤️</span> by <span className="text-wine font-bold">Roborregos</span>
              </p>
              <p className="mt-2 text-[10px] text-rose-dust/50">© 2024 RoboCupido. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </HydrateClient>
  );
}

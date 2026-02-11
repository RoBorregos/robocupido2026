import { HydrateClient } from "~/trpc/server";
import HeartParticles from "./_components/heartParticles";
import Header from "./_components/header";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {

  return (
    <HydrateClient>
      <div className="bg-background-light font-display text-wine relative min-h-screen overflow-x-hidden transition-colors duration-300">
        {/* Heart Particles Animation Background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <HeartParticles />
        </div>

        {/* Header/Navbar */}
        <Header />

        {/* Main Content */}
        <main className="relative z-10">
          <section className="soft-gradient-bg relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-20 text-center">
            <div className="heart-glow relative z-0 mb-10">
              <div className="bg-primary/20 absolute inset-0 scale-75 animate-pulse rounded-full blur-[60px]"></div>
              <div className="shadow-primary/5 border-primary/5 relative flex h-24 w-24 items-center justify-center rounded-full border bg-white shadow-lg transition-transform duration-500 hover:scale-105 md:h-32 md:w-32">
                <svg
                  className="text-primary heart-pulse h-12 w-12 fill-current md:h-16 md:w-16"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
            <div className="max-w-225 space-y-6 md:space-y-8">
              <h1 className="hero-title text-wine text-5xl font-extrabold tracking-tight md:text-8xl">
                RoboCupido
              </h1>
              <p className="text-rose-dust/80 mx-auto max-w-145 text-base font-medium md:text-lg">
                By Roborregos
              </p>
              <div className="pt-6">
                <Link
                  href="/questionnaire"
                  className="bg-primary shadow-primary/30 mx-auto flex h-14 w-fit items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white shadow-xl transition-all hover:translate-y-0.5 hover:shadow-2xl active:translate-y-0"
                >
                  Encuentra tu match
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </HydrateClient>
  );
}

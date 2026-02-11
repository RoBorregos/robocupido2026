"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Heart, Sparkles, Calendar, Clock, LogOut } from "lucide-react";
import Link from "next/link";

const WaitingPage = () => {
  const router = useRouter();
  const profileQuery = api.user.getProfileDescription.useQuery();

  useEffect(() => {
    // If user hasn't completed their profile, redirect to chat
    if (profileQuery.data && !profileQuery.data.profileDescription) {
      router.push("/chat");
    }
  }, [profileQuery.data, router]);

  if (profileQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-3 w-3 animate-bounce rounded-full bg-pink-400"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <span className="text-white/60">Cargando tu perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500/20 blur-3xl" />
        <div
          className="absolute top-1/4 -right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-rose-500/20 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        {Array.from({ length: 30 }).map((_, i) => (
          <Heart
            key={i}
            className="absolute animate-pulse text-pink-500/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="relative">
              <Heart className="h-8 w-8 fill-pink-500 text-pink-500" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <h1 className="bg-linear-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                RoBoCupido
              </h1>
              <p className="text-xs text-white/50">
                Tu match perfecto te espera
              </p>
            </div>
          </Link>
          <Link
            href="/logout"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Success animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-pink-500/30" />
              <div className="relative rounded-full bg-linear-to-br from-pink-500 to-purple-600 p-6">
                <Heart className="h-12 w-12 fill-white text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="bg-linear-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              ¡Perfil Completado!
            </h2>
            <p className="mt-2 text-white/60">
              Hemos analizado tus respuestas y creado tu perfil de amor
            </p>
          </div>

          {/* Profile description card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Tu Perfil</h3>
            </div>
            <p className="leading-relaxed text-white/80">
              {profileQuery.data?.profileDescription ?? "Cargando descripción..."}
            </p>
          </div>

          {/* What you're looking for card */}
          {profileQuery.data?.aboutThem && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-400" />
                <h3 className="text-lg font-semibold text-white">Lo que buscas</h3>
              </div>
              <p className="leading-relaxed text-white/80">
                {profileQuery.data.aboutThem}
              </p>
            </div>
          )}

          {/* Waiting card */}
          <div className="rounded-2xl border border-pink-500/20 bg-linear-to-r from-pink-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-pink-500/20 p-3">
                <Calendar className="h-8 w-8 text-pink-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  ¡Espera tus matches!
                </h3>
                <p className="text-white/60">
                  Los resultados se revelarán el{" "}
                  <span className="font-bold text-pink-400">14 de Febrero</span>
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-black/20 py-3">
              <Clock className="h-5 w-5 text-purple-400" />
              <span className="text-white/80">
                San Valentín está a la vuelta de la esquina 💘
              </span>
            </div>
          </div>

          {/* Fun message */}
          <div className="text-center">
            <p className="text-sm text-white/40">
              Mientras tanto, cruza los dedos y piensa en el amor... 🤞✨
            </p>
          </div>

          {/* Back to home button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaitingPage;

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Heart, Sparkles, Calendar, Clock, LogOut } from "lucide-react";
import Link from "next/link";
import Header from "../../_components/header";
import HeartParticles from "../../_components/heartParticles";

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
      <div className="bg-background-light font-display text-wine flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="bg-primary h-3 w-3 animate-bounce rounded-full"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <span className="text-rose-brown">Cargando tu perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light font-display text-wine relative min-h-screen w-full overflow-hidden transition-colors duration-300">
      {/* Heart Particles Animation Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HeartParticles />
      </div>

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="gradient-bg relative z-10 flex flex-col items-center px-4 py-12 pt-24">
        <div className="w-full max-w-2xl space-y-8">
          {/* Success animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-primary/30 absolute inset-0 animate-ping rounded-full" />
              <div className="bg-primary relative rounded-full p-6">
                <Heart className="h-12 w-12 fill-white text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-wine text-3xl font-bold md:text-4xl">
              ¡Perfil Completado!
            </h2>
            <p className="text-rose-brown mt-2">
              Hemos analizado tus respuestas y creado tu perfil de amor
            </p>
          </div>

          {/* Profile description card */}
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <h3 className="text-wine text-lg font-semibold">Tu Perfil</h3>
            </div>
            <p className="text-rose-brown leading-relaxed">
              {profileQuery.data?.profileDescription ?? "Cargando descripción..."}
            </p>
          </div>

          {/* What you're looking for card */}
          {profileQuery.data?.aboutThem && (
            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-2">
                <Heart className="text-primary h-5 w-5" />
                <h3 className="text-wine text-lg font-semibold">Lo que buscas</h3>
              </div>
              <p className="text-rose-brown leading-relaxed">
                {profileQuery.data.aboutThem}
              </p>
            </div>
          )}

          {/* Waiting card */}
          <div className="bg-primary/10 rounded-2xl border border-pink-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 rounded-full p-3">
                <Calendar className="text-primary h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-wine text-lg font-semibold">
                  ¡Espera tus matches!
                </h3>
                <p className="text-rose-brown">
                  Los resultados se revelarán el{" "}
                  <span className="text-primary font-bold">14 de Febrero</span>
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/50 py-3">
              <Clock className="text-primary h-5 w-5" />
              <span className="text-wine">
                San Valentín está a la vuelta de la esquina 💘
              </span>
            </div>
          </div>

          {/* Fun message */}
          <div className="text-center">
            <p className="text-rose-brown/60 text-sm">
              Mientras tanto, cruza los dedos y piensa en el amor... 🤞✨
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="text-wine hover:border-primary rounded-full border border-pink-200 bg-white px-6 py-3 text-center transition-all hover:bg-pink-50"
            >
              Volver al inicio
            </Link>
            <Link
              href="/logout"
              className="text-rose-brown hover:text-wine flex items-center justify-center gap-2 rounded-full border border-pink-100 px-6 py-3 transition-all hover:bg-pink-50"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaitingPage;

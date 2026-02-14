"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Calendar, ArrowRight } from "lucide-react";
import { api } from "~/trpc/react";
import Header from "../../_components/header";
import HeartParticlesWrapper from "../../_components/heartParticlesWrapper";

export default function RegistrationEndedPage() {
  const router = useRouter();
  const profileStatusQuery = api.user.getProfileStatus.useQuery();

  useEffect(() => {
    if (profileStatusQuery.data) {
      // If user has completed their profile, redirect to waiting/profile
      if (profileStatusQuery.data.hasCompletedChat) {
        router.push("/waiting");
      }
    }
  }, [profileStatusQuery.data, router]);

  if (profileStatusQuery.isLoading) {
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
          <span className="text-rose-brown">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light font-display text-wine relative min-h-screen overflow-x-hidden transition-colors duration-300">
      {/* Heart Particles Animation Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HeartParticlesWrapper />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20">
        <div className="w-full max-w-lg space-y-8 text-center">
          {/* Heart Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-primary/20 absolute inset-0 scale-150 rounded-full blur-xl" />
              <div className="bg-primary/10 relative rounded-full p-8 border border-pink-200">
                <Heart className="text-primary h-16 w-16 opacity-50" />
              </div>
            </div>
          </div>

          {/* Main Message Card */}
          <div className="rounded-2xl border border-pink-100 bg-white p-8 shadow-xl">
            <h1 className="text-wine text-3xl font-bold md:text-4xl mb-4">
              Robocupido ha finalizado
            </h1>
            
            <p className="text-rose-brown text-lg leading-relaxed mb-6">
              El período de registro para este año ha terminado. No pudimos completar tu perfil a tiempo.
            </p>

            <div className="bg-primary/5 rounded-xl p-6 border border-pink-100">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="text-primary h-5 w-5" />
                <span className="text-wine font-semibold">¡Nos vemos pronto!</span>
              </div>
              <p className="text-rose-brown">
                Te invitamos a participar el siguiente año. ¡Prepárate para encontrar el amor! 💕
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-wine transition-colors font-medium"
          >
            <span>Volver al inicio</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

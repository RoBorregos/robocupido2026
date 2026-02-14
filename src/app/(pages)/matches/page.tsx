"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Heart, Instagram, Sparkles, GraduationCap, Calendar, Users, LogOut } from "lucide-react";
import Link from "next/link";
import Header from "../../_components/header";
import HeartParticlesWrapper from "../../_components/heartParticlesWrapper";

const MatchCard = ({
  rank,
  score,
  matchedUser,
}: {
  rank: number;
  score: number;
  matchedUser: {
    name: string | null;
    instagram: string | null;
    age: number | null;
    carrera: string | null;
    lookingFor: string | null;
    profileDescription: string | null;
  };
}) => {
  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "💘";
      case 2:
        return "💕";
      case 3:
        return "💗";
      case 4:
        return "💝";
      default:
        return "❤️";
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1:
        return "Match Principal";
      case 2:
        return "Segundo Match";
      case 3:
        return "Tercer Match";
      case 4:
        return "Cuarto Match";
      default:
        return `Match #${rank}`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  return (
    <div className="group rounded-2xl border border-pink-100 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      {/* Header with rank and score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getRankEmoji(rank)}</span>
          <span className="text-wine font-semibold">{getRankLabel(rank)}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(score)}`}>
          {Math.round(score)}% compatible
        </div>
      </div>

      {/* User info */}
      <div className="space-y-4">
        {/* Name */}
        <h3 className="text-2xl font-bold text-wine">
          {matchedUser.name ?? "Usuario"}
        </h3>

        {/* Quick info */}
        <div className="flex flex-wrap gap-3 text-sm text-rose-brown">
          {matchedUser.age && (
            <div className="flex items-center gap-1.5 bg-pink-50 px-3 py-1.5 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{matchedUser.age} años</span>
            </div>
          )}
          {matchedUser.carrera && (
            <div className="flex items-center gap-1.5 bg-pink-50 px-3 py-1.5 rounded-full">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>{matchedUser.carrera}</span>
            </div>
          )}
          {matchedUser.lookingFor && (
            <div className="flex items-center gap-1.5 bg-pink-50 px-3 py-1.5 rounded-full">
              <Users className="h-4 w-4 text-primary" />
              <span>{matchedUser.lookingFor}</span>
            </div>
          )}
        </div>

        {/* Profile description */}
        {matchedUser.profileDescription && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-wine font-medium text-sm">Sobre esta persona</span>
            </div>
            <p className="text-rose-brown text-sm leading-relaxed">
              {matchedUser.profileDescription}
            </p>
          </div>
        )}

        {/* Instagram CTA */}
        {matchedUser.instagram && (
          <a
            href={`https://instagram.com/${matchedUser.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Instagram className="h-5 w-5" />
            <span>Contactar en Instagram</span>
            <span className="opacity-80">({matchedUser.instagram})</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default function MatchesPage() {
  const router = useRouter();
  const profileStatusQuery = api.user.getProfileStatus.useQuery();
  const matchesQuery = api.user.getMatches.useQuery();

  useEffect(() => {
    if (profileStatusQuery.data) {
      // If user hasn't completed their profile, redirect appropriately
      if (!profileStatusQuery.data.hasCompletedChat) {
        router.push("/registration-ended");
      }
    }
  }, [profileStatusQuery.data, router]);

  if (profileStatusQuery.isLoading || matchesQuery.isLoading) {
    return (
      <div className="bg-background-light font-display text-wine flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="bg-primary h-4 w-4 animate-bounce rounded-full"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <span className="text-rose-brown text-lg">Cargando tus matches...</span>
        </div>
      </div>
    );
  }

  const matches = matchesQuery.data ?? [];

  return (
    <div className="bg-background-light font-display text-wine relative min-h-screen overflow-x-hidden transition-colors duration-300">
      {/* Heart Particles Animation Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HeartParticlesWrapper />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-4 py-12 pt-24">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-primary/20 absolute inset-0 scale-150 rounded-full blur-xl animate-pulse" />
                <div className="bg-primary relative rounded-full p-6">
                  <Heart className="h-12 w-12 fill-white text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-wine mb-4">
              ¡Tus Matches! 💘
            </h1>
            <p className="text-rose-brown text-lg max-w-xl mx-auto">
              RoboCupido ha encontrado a las personas más compatibles contigo. 
              ¡Es hora de conectar!
            </p>
          </div>

          {/* Matches Grid */}
          {matches.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  rank={match.rank}
                  score={match.score}
                  matchedUser={match.matchedUser}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-pink-100 shadow-xl">
              <Heart className="h-16 w-16 text-primary/30 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-wine mb-2">
                Matches en proceso
              </h2>
              <p className="text-rose-brown max-w-md mx-auto">
                Estamos procesando los matches. Vuelve pronto para ver tus resultados.
              </p>
            </div>
          )}

          {/* Footer info */}
          <div className="mt-10 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100 inline-block">
              <p className="text-rose-brown text-sm">
                💡 <strong>Tip:</strong> No seas tímido/a, ¡envía el primer mensaje! 
                El amor espera a quienes toman la iniciativa. 
              </p>
            </div>
          </div>

          {/* Logout button */}
          <div className="mt-8 text-center">
            <Link
              href="/logout"
              className="inline-flex items-center gap-2 text-rose-brown hover:text-wine transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

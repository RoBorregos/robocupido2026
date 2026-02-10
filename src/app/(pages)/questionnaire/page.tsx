"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function QuestionnairePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    age: "",
    genre: "",
    instagram: "",
    lookingFor: "",
    preferences: "",
  });

  const submitProfile = api.user.submitProfile.useMutation({
    onSuccess: () => router.push("/chat"),
  });

  const needsPreferences =
    form.lookingFor === "Pareja" || form.lookingFor === "Algo casual";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProfile.mutate({
      age: parseInt(form.age),
      genre: form.genre,
      instagram: form.instagram,
      lookingFor: form.lookingFor,
      preferences: needsPreferences ? form.preferences : null,
    });
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.age &&
    form.genre &&
    form.instagram &&
    form.lookingFor &&
    (!needsPreferences || form.preferences);

  return (
    <div className="relative flex min-h-screen flex-col bg-linear-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background effects */}
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
              <p className="text-xs text-white/50">Cuentanos de ti</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
        >
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-white">
              Sobre ti
            </h2>
            <p className="text-sm text-white/60">
              Responde estas preguntas para encontrar tu match ideal
            </p>
          </div>

          {/* Age */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Edad
            </label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="Ej: 20"
              min={16}
              max={100}
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Genero
            </label>
            <select
              value={form.genre}
              onChange={(e) => update("genre", e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition-all focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
            >
              <option value="" disabled className="bg-slate-900">
                Selecciona
              </option>
              <option value="Hombre" className="bg-slate-900">
                Hombre
              </option>
              <option value="Mujer" className="bg-slate-900">
                Mujer
              </option>
              <option value="No binario" className="bg-slate-900">
                No binario
              </option>
              <option value="Otro" className="bg-slate-900">
                Otro
              </option>
            </select>
          </div>

          {/* Instagram */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Instagram
            </label>
            <input
              type="text"
              value={form.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              placeholder="Ej: @tuusuario"
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
            />
          </div>

          {/* Looking For */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Busco
            </label>
            <select
              value={form.lookingFor}
              onChange={(e) => update("lookingFor", e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition-all focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
            >
              <option value="" disabled className="bg-slate-900">
                Selecciona
              </option>
              <option value="Pareja" className="bg-slate-900">
                Pareja
              </option>
              <option value="Amigos" className="bg-slate-900">
                Amigos
              </option>
              <option value="Algo casual" className="bg-slate-900">
                Algo casual
              </option>
            </select>
          </div>

          {/* Preferences - only for Pareja / Algo casual */}
          {needsPreferences && (
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Me interesan
              </label>
              <select
                value={form.preferences}
                onChange={(e) => update("preferences", e.target.value)}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition-all focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
              >
                <option value="" disabled className="bg-slate-900">
                  Selecciona
                </option>
                <option value="Hombres" className="bg-slate-900">
                  Hombres
                </option>
                <option value="Mujeres" className="bg-slate-900">
                  Mujeres
                </option>
                <option value="Indiferente" className="bg-slate-900">
                  Indiferente
                </option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || submitProfile.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-600 to-purple-600 px-6 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitProfile.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Guardando...
              </>
            ) : (
              <>
                Continuar al chat
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {submitProfile.isError && (
            <p className="text-center text-sm text-red-400">
              Hubo un error, intenta de nuevo.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

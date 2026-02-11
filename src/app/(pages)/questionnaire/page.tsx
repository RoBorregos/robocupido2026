"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ArrowRight } from "lucide-react";
import Header from "../../_components/header";

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
    <div className="bg-background-light font-display text-wine relative min-h-screen transition-colors duration-300 overflow-x-hidden">
      {/* Top Navigation */}
      <Header />

      {/* Main Content */}
      <main className="gradient-bg flex flex-col items-center justify-center px-6 py-10 min-h-[calc(100vh-80px)]">
        <div className="max-w-[600px] w-full space-y-12">
          {/* Progress Section */}
          <div className="w-full flex flex-col gap-4 mb-2">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">Tu Perfil</p>
                <h3 className="text-wine text-2xl font-bold">Paso 1 de 1</h3>
              </div>
              <p className="text-wine text-lg font-medium opacity-60">100%</p>
            </div>
            <div className="h-3 w-full bg-pink-100/50 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "100%" }}></div>
            </div>
            <p className="text-rose-brown text-sm font-medium">Casi listo para encontrar tu match ideal...</p>
          </div>

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="group relative bg-white border border-pink-100 p-8 md:p-10 rounded-2xl shadow-xl transition-all duration-300"
          >
            <div className="text-center mb-10">
              <h1 className="font-serif text-4xl md:text-5xl text-wine leading-tight mb-4">
                Cuéntanos sobre ti
              </h1>
              <p className="text-rose-brown font-medium">
                Esta información nos ayudará a encontrar personas compatibles contigo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <label className="text-primary text-sm font-bold uppercase tracking-wider">Edad</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  placeholder="Ej: 20"
                  min={16}
                  max={100}
                  required
                  className="w-full rounded-xl border-2 border-pink-50 bg-[#FDF8F9]/50 px-4 py-4 text-wine placeholder-rose-brown/40 transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm"
                />
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <label className="text-primary text-sm font-bold uppercase tracking-wider">Género</label>
                <select
                  value={form.genre}
                  onChange={(e) => update("genre", e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-pink-50 bg-[#FDF8F9]/50 px-4 py-4 text-wine transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-white">Selecciona</option>
                  <option value="Hombre" className="bg-white">Hombre</option>
                  <option value="Mujer" className="bg-white">Mujer</option>
                  <option value="No binario" className="bg-white">No binario</option>
                  <option value="Otro" className="bg-white">Otro</option>
                </select>
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <label className="text-primary text-sm font-bold uppercase tracking-wider">Instagram</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-brown font-bold">@</span>
                  <input
                    type="text"
                    value={form.instagram.startsWith("@") ? form.instagram.slice(1) : form.instagram}
                    onChange={(e) => update("instagram", "@" + e.target.value)}
                    placeholder="tuusuario"
                    required
                    className="w-full rounded-xl border-2 border-pink-50 bg-[#FDF8F9]/50 pl-10 pr-4 py-4 text-wine placeholder-rose-brown/40 transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm"
                  />
                </div>
              </div>

              {/* Looking For */}
              <div className="space-y-2">
                <label className="text-primary text-sm font-bold uppercase tracking-wider">Busco</label>
                <select
                  value={form.lookingFor}
                  onChange={(e) => update("lookingFor", e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-pink-50 bg-[#FDF8F9]/50 px-4 py-4 text-wine transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-white">Selecciona</option>
                  <option value="Pareja" className="bg-white">Pareja</option>
                  <option value="Amigos" className="bg-white">Amigos</option>
                  <option value="Algo casual" className="bg-white">Algo casual</option>
                </select>
              </div>

              {/* Preferences */}
              {needsPreferences && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="text-primary text-sm font-bold uppercase tracking-wider">Me interesan</label>
                  <select
                    value={form.preferences}
                    onChange={(e) => update("preferences", e.target.value)}
                    required
                    className="w-full rounded-xl border-2 border-pink-50 bg-[#FDF8F9]/50 px-4 py-4 text-wine transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-white">Selecciona</option>
                    <option value="Hombres" className="bg-white">Hombres</option>
                    <option value="Mujeres" className="bg-white">Mujeres</option>
                    <option value="Indiferente" className="bg-white">Indiferente</option>
                  </select>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-10 mt-10 border-t border-pink-100">
              <button
                type="submit"
                disabled={!isValid || submitProfile.isPending}
                className="bg-primary shadow-primary/20 flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {submitProfile.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Guardando...
                  </>
                ) : (
                  <>
                    Continuar al chat
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              {submitProfile.isError && (
                <p className="mt-4 text-center text-sm font-bold text-primary animate-pulse">
                  Hubo un error, intenta de nuevo.
                </p>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center opacity-40">
        <p className="text-rose-brown text-xs uppercase tracking-widest font-bold">
          Hecho con amor por Roborregos • 2024
        </p>
      </footer>
    </div>
  );
}

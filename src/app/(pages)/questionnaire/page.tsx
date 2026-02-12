"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ArrowRight } from "lucide-react";
import Header from "../../_components/header";

export default function QuestionnairePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    age: "",
    gender: "",
    instagram: "",
    lookingFor: "",
    preferences: "",
    carrera: "",
    semestre: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showErrors, setShowErrors] = useState(false);

  const hasCompletedQuery = api.user.hasCompletedProfile.useQuery();

  useEffect(() => {
    if (hasCompletedQuery.data?.completed) {
      router.push("/waiting");
    }
  }, [hasCompletedQuery.data, router]);

  const submitProfile = api.user.submitProfile.useMutation({
    onSuccess: () => router.push("/chat"),
  });

  const needsPreferences =
    form.lookingFor === "Pareja" || form.lookingFor === "Algo casual";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (!isValid) {
      return;
    }
    submitProfile.mutate({
      age: parseInt(form.age),
      gender: form.gender,
      instagram: form.instagram,
      lookingFor: form.lookingFor,
      preferences: needsPreferences ? form.preferences : null,
      carrera: form.carrera,
      semestre: parseInt(form.semestre),
    });
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validationErrors = {
    age: !form.age ? "La edad es requerida" : parseInt(form.age) < 18 ? "Debes ser mayor de 18 años" : null,
    gender: !form.gender ? "El género es requerido" : null,
    instagram: !form.instagram || form.instagram === "@" ? "El Instagram es requerido" : null,
    lookingFor: !form.lookingFor ? "Selecciona qué buscas" : null,
    carrera: !form.carrera ? "La carrera es requerida" : null,
    semestre: !form.semestre ? "El semestre es requerido" : null,
    preferences: needsPreferences && !form.preferences ? "Selecciona tus preferencias" : null,
  };

  const isValid = Object.values(validationErrors).every((error) => error === null);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleAgeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent 'e', 'E', '+', '-', '.' characters
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    update("age", value);
  };

  if (hasCompletedQuery.isLoading) {
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
    <div className="bg-background-light font-display text-wine min-h-screen transition-colors duration-300">
      <Header />

      <main className="gradient-bg flex flex-col items-center px-4 sm:px-6 py-6 sm:py-10 pt-20 sm:pt-24">
        <div className="w-full max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-pink-100 p-5 sm:p-8 rounded-2xl shadow-xl"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-wine leading-tight mb-3">
                Cuéntanos sobre ti
              </h1>
              <p className="text-rose-brown font-medium text-sm sm:text-base">
                Esta información nos ayudará a encontrar personas compatibles contigo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">Edad</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={handleAgeChange}
                  onKeyDown={handleAgeKeyDown}
                  onBlur={() => handleBlur("age")}
                  placeholder="Ej: 20"
                  min={18}
                  max={100}
                  required
                  className={`w-full rounded-xl border-2 ${(showErrors || touched.age) && validationErrors.age ? "border-red-400" : "border-pink-50"} bg-[#FDF8F9]/50 px-3 sm:px-4 py-3 text-wine placeholder-rose-brown/40 transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm text-sm sm:text-base`}
                />
                {(showErrors || touched.age) && validationErrors.age && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.age}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">Género</label>
                <select
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  onBlur={() => handleBlur("gender")}
                  required
                  className={`w-full rounded-xl border-2 ${(showErrors || touched.gender) && validationErrors.gender ? "border-red-400" : "border-pink-50"} bg-[#FDF8F9]/50 px-3 sm:px-4 py-3 text-wine transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm appearance-none cursor-pointer text-sm sm:text-base`}
                >
                  <option value="" disabled className="bg-white">Selecciona</option>
                  <option value="Hombre" className="bg-white">Hombre</option>
                  <option value="Mujer" className="bg-white">Mujer</option>
                  <option value="No binario" className="bg-white">No binario</option>
                  <option value="Otro" className="bg-white">Otro</option>
                </select>
                {(showErrors || touched.gender) && validationErrors.gender && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.gender}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">Instagram</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-rose-brown font-bold text-sm sm:text-base">@</span>
                  <input
                    type="text"
                    value={form.instagram.startsWith("@") ? form.instagram.slice(1) : form.instagram}
                    onChange={(e) => update("instagram", "@" + e.target.value)}
                    onBlur={() => handleBlur("instagram")}
                    placeholder="tuusuario"
                    required
                    className={`w-full rounded-xl border-2 ${(showErrors || touched.instagram) && validationErrors.instagram ? "border-red-400" : "border-pink-50"} bg-[#FDF8F9]/50 pl-8 sm:pl-10 pr-3 sm:pr-4 py-3 text-wine placeholder-rose-brown/40 transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm text-sm sm:text-base`}
                  />
                </div>
                {(showErrors || touched.instagram) && validationErrors.instagram && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.instagram}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">Carrera</label>
                <input
                  type="text"
                  value={form.carrera}
                  onChange={(e) => update("carrera", e.target.value)}
                  onBlur={() => handleBlur("carrera")}
                  placeholder="Ej: Ingeniería en Sistemas"
                  required
                  className={`w-full rounded-xl border-2 ${(showErrors || touched.carrera) && validationErrors.carrera ? "border-red-400" : "border-pink-50"} bg-[#FDF8F9]/50 px-3 sm:px-4 py-3 text-wine placeholder-rose-brown/40 transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm text-sm sm:text-base`}
                />
                {(showErrors || touched.carrera) && validationErrors.carrera && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.carrera}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">Semestre</label>
                <select
                  value={form.semestre}
                  onChange={(e) => update("semestre", e.target.value)}
                  onBlur={() => handleBlur("semestre")}
                  required
                  className={`w-full rounded-xl border-2 ${(showErrors || touched.semestre) && validationErrors.semestre ? "border-red-400" : "border-pink-50"} bg-[#FDF8F9]/50 px-3 sm:px-4 py-3 text-wine transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm appearance-none cursor-pointer text-sm sm:text-base`}
                >
                  <option value="" disabled className="bg-white">Selecciona</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sem) => (
                    <option key={sem} value={sem} className="bg-white">
                      {sem}° Semestre
                    </option>
                  ))}
                </select>
                {(showErrors || touched.semestre) && validationErrors.semestre && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.semestre}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">Busco</label>
                <select
                  value={form.lookingFor}
                  onChange={(e) => update("lookingFor", e.target.value)}
                  onBlur={() => handleBlur("lookingFor")}
                  required
                  className={`w-full rounded-xl border-2 ${(showErrors || touched.lookingFor) && validationErrors.lookingFor ? "border-red-400" : "border-pink-50"} bg-[#FDF8F9]/50 px-3 sm:px-4 py-3 text-wine transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm appearance-none cursor-pointer text-sm sm:text-base`}
                >
                  <option value="" disabled className="bg-white">Selecciona</option>
                  <option value="Pareja" className="bg-white">Pareja</option>
                  <option value="Amigos" className="bg-white">Amigos</option>
                  <option value="Algo casual" className="bg-white">Algo casual</option>
                </select>
                {(showErrors || touched.lookingFor) && validationErrors.lookingFor && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.lookingFor}</p>
                )}
              </div>

              {needsPreferences && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">Me interesan</label>
                  <select
                    value={form.preferences}
                    onChange={(e) => update("preferences", e.target.value)}
                    onBlur={() => handleBlur("preferences")}
                    required
                    className={`w-full rounded-xl border-2 ${(showErrors || touched.preferences) && validationErrors.preferences ? "border-red-400" : "border-pink-50"} bg-[#FDF8F9]/50 px-3 sm:px-4 py-3 text-wine transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm appearance-none cursor-pointer text-sm sm:text-base`}
                  >
                    <option value="" disabled className="bg-white">Selecciona</option>
                    <option value="Hombres" className="bg-white">Hombres</option>
                    <option value="Mujeres" className="bg-white">Mujeres</option>
                    <option value="Indiferente" className="bg-white">Indiferente</option>
                  </select>
                  {(showErrors || touched.preferences) && validationErrors.preferences && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.preferences}</p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-pink-100">
              <button
                type="submit"
                disabled={!isValid || submitProfile.isPending}
                className="bg-primary shadow-primary/20 flex w-full items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {submitProfile.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Guardando...
                  </>
                ) : (
                  <>
                    Continuar al chat
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                )}
              </button>
              {submitProfile.isError && (
                <p className="mt-3 text-center text-xs sm:text-sm font-bold text-primary animate-pulse">
                  Hubo un error, intenta de nuevo.
                </p>
              )}
            </div>
          </form>
        </div>
      </main>

      <footer className="w-full py-4 sm:py-6 text-center opacity-40">
        <p className="text-rose-brown text-xs uppercase tracking-widest font-bold">
          Hecho con amor por Roborregos • 2024
        </p>
      </footer>
    </div>
  );
}

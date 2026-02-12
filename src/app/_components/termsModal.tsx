"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";

export default function TermsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleAccept = () => {
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary shadow-primary/30 mx-auto flex h-14 min-w-55 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold text-white shadow-xl transition-all hover:translate-y-0.5 hover:shadow-2xl active:translate-y-0"
      >
        Encuentra tu match
        <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-pink-100 px-6 py-4 dark:border-white/10">
              <h2 className="text-xl font-bold text-wine">
                Términos y Condiciones
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  Bienvenido a RoboCupido. Al utilizar este servicio, aceptas
                  los siguientes términos y condiciones:
                </p>

                <h3 className="font-semibold text-wine">
                  1. Uso del Servicio
                </h3>
                <p>
                  Este servicio está diseñado exclusivamente para estudiantes y
                  personal del Tecnológico de Monterrey con cuenta @tec.mx. Al
                  registrarte, confirmas que eres parte de la comunidad Tec.
                </p>

                <h3 className="font-semibold text-wine">
                  2. Privacidad de Datos
                </h3>
                <p>
                  Tus respuestas al cuestionario serán utilizadas únicamente
                  para encontrar compatibilidades con otros usuarios. No
                  compartiremos tu información personal con terceros sin tu
                  consentimiento.
                </p>

                <h3 className="font-semibold text-wine">
                  3. Conducta del Usuario
                </h3>
                <p>
                  Te comprometes a utilizar el servicio de manera respetuosa y
                  apropiada. Cualquier comportamiento ofensivo o inapropiado
                  puede resultar en la suspensión de tu cuenta.
                </p>

                <h3 className="font-semibold text-wine">
                  4. Responsabilidad
                </h3>
                <p>
                  RoboCupido es un proyecto desarrollado por RoBorregos con
                  fines de entretenimiento.
                </p>

                <h3 className="font-semibold text-wine">
                  5. Modificaciones
                </h3>
                <p>
                  Nos reservamos el derecho de modificar estos términos en
                  cualquier momento. El uso continuado del servicio después de
                  cambios constituye aceptación de los nuevos términos.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-pink-100 px-6 py-4 dark:border-white/10">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                className="bg-primary flex-1 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

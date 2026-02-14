import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import HeartParticlesWrapper from "./_components/heartParticlesWrapper";
import Header from "./_components/header";
import TermsModal from "./_components/termsModal";

// Registration is closed
const REGISTRATION_CLOSED = true;

export default async function Home() {
  // Check if user is authenticated
  const session = await auth();
  
  if (session?.user) {
    // User is authenticated, check their profile status and matches
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        profileDescription: true,
        matchesReceived: {
          select: { id: true },
          take: 1,
        },
      },
    });
    
    const hasCompletedProfile = !!user?.profileDescription;
    const hasMatches = (user?.matchesReceived?.length ?? 0) > 0;
    
    if (hasCompletedProfile) {
      // User completed their profile
      if (hasMatches) {
        // User has matches - redirect to matches page
        redirect("/matches");
      } else {
        // User has no matches yet - redirect to waiting page
        redirect("/waiting");
      }
    } else if (REGISTRATION_CLOSED) {
      // Registration is closed and user didn't complete profile
      redirect("/registration-ended");
    } else {
      // Registration is open - redirect to questionnaire
      redirect("/questionnaire");
    }
  }

  return (
    <HydrateClient>
      <div className="bg-background-light font-display text-wine relative min-h-screen overflow-x-hidden transition-colors duration-300">
        {/* Heart Particles Animation Background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <HeartParticlesWrapper />
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
                <TermsModal />
              </div>
            </div>
          </section>
        </main>
      </div>
    </HydrateClient>
  );
}

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import HeartParticles from "./_components/heartParticles";
import Welcome from "./_components/welcome";
import Header from "./_components/header";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-rose-300 text-white">
        <HeartParticles/>
        <Welcome/>
        <Header/>
      </main>
    </HydrateClient>
  );
}

import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 },
      );
    }

    if (session.user.email !== email) {
      return NextResponse.json(
        { error: "No autorizado para ver este perfil" },
        { status: 403 },
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    return NextResponse.json({
      hasSubmitted: !!user?.fullName,
      profileId: user?.id ?? null,
    });
  } catch (error) {
    console.error("Error checking profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

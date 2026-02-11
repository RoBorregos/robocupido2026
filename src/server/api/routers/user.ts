import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        age: true,
        gender: true,
        instagram: true,
        lookingFor: true,
        preferences: true,
        carrera: true,
        semestre: true,
      },
    });
  }),

  getProfileDescription: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        aboutMe: true,
        aboutThem: true,
      },
    });

    return {
      profileDescription: user?.aboutMe ?? null,
      aboutMe: user?.aboutMe ?? null,
      aboutThem: user?.aboutThem ?? null,
    };
  }),

  hasCompletedProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        profileDescription: true,
      },
    });
    return { completed: !!user?.profileDescription };
  }),

  submitProfile: protectedProcedure
    .input(
      z.object({
        age: z.number().min(16).max(100),
        gender: z.string().min(1),
        instagram: z.string().min(1),
        lookingFor: z.string().min(1),
        preferences: z.string().min(1).nullable(),
        carrera: z.string().min(1),
        semestre: z.number().min(1).max(12),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),
});

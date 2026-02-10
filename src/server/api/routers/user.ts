import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        age: true,
        genre: true,
        instagram: true,
        lookingFor: true,
        preferences: true,
      },
    });
  }),

  submitProfile: protectedProcedure
    .input(
      z.object({
        age: z.number().min(16).max(100),
        genre: z.string().min(1),
        instagram: z.string().min(1),
        lookingFor: z.string().min(1),
        preferences: z.string().min(1).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),
});

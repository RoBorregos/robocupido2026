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
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        profileDescription: true,
        aboutMe: true,
        aboutThem: true,
      },
    });
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

  // Check if user has filled the basic questionnaire but not completed the chat
  getProfileStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        age: true,
        gender: true,
        instagram: true,
        lookingFor: true,
        profileDescription: true,
      },
    });
    
    // User has filled the questionnaire if they have age, gender, instagram, and lookingFor
    const hasFilledQuestionnaire = !!(user?.age && user?.gender && user?.instagram && user?.lookingFor);
    // User has completed the chat if they have a profile description
    const hasCompletedChat = !!user?.profileDescription;
    
    return {
      hasFilledQuestionnaire,
      hasCompletedChat,
    };
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

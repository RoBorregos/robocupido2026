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

  // Get user's matches
  getMatches: protectedProcedure.query(async ({ ctx }) => {
    const matches = await ctx.db.match.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { rank: "asc" },
      include: {
        matched: {
          select: {
            id: true,
            name: true,
            instagram: true,
            age: true,
            carrera: true,
            lookingFor: true,
            profileDescription: true,
          },
        },
      },
    });

    return matches.map((match) => ({
      id: match.id,
      rank: match.rank,
      score: match.score,
      matchedUser: {
        id: match.matched.id,
        name: match.matched.name,
        instagram: match.matched.instagram,
        age: match.matched.age,
        carrera: match.matched.carrera,
        lookingFor: match.matched.lookingFor,
        profileDescription: match.matched.profileDescription,
      },
    }));
  }),

  // Check if user has matches
  hasMatches: protectedProcedure.query(async ({ ctx }) => {
    const matchCount = await ctx.db.match.count({
      where: { userId: ctx.session.user.id },
    });
    return { hasMatches: matchCount > 0, count: matchCount };
  }),
});

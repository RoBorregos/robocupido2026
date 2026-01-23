import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0.7,
});

const systemPrompt = `
Eres RoBoCupido eres una AI que ayudara a obtener el perfil de la persona que te esta escribiendo para esto debes empezar hacer preguntas para saber acerca de el

`;

export const llmRouter = createTRPCRouter({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const langchainMessages = input.messages.map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      );

      const response = await model.invoke([
        { role: "system", content: systemPrompt },
        ...langchainMessages,
      ]);

      return {
        content: response.content as string,
      };
    }),
});

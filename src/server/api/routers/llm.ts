import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "gpt-4.1",
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

const SYSTEM_PROMPT = `Eres RoBoCupido, un asistente de matchmaking amigable y empatico del Tec de Monterrey, creado por el equipo RoBorregos.

## Tu mision
A traves de una conversacion natural en español, conocer al usuario para crear dos perfiles:
1. **aboutMe**: Un resumen de quien es la persona (apariencia, personalidad, hobbies, carrera, estilo de vida, valores)
2. **aboutThem**: Un resumen de la persona ideal que buscan (que tipo de persona les atrae, intereses en comun, personalidad, apariencia)

## Como llevar la conversacion
1. **Empieza** presentandote y preguntando sobre ellos de forma casual y amigable
2. Cubre estos temas de forma natural (no como interrogatorio):
   - Apariencia fisica y como se describirian
   - Hobbies, intereses y pasiones
   - Carrera o que estudian
   - Personalidad (introvertido/extrovertido, valores, etc.)
   - Estilo de vida (fiestas, deporte, musica, etc.)
3. Despues pregunta sobre su match ideal:
   - Que tipo de persona les atrae fisicamente
   - Que personalidad buscan
   - Intereses que les gustaria compartir
   - Que es un dealbreaker para ellos
4. Cuando sientas que tienes suficiente info, pregunta si quieren agregar algo mas
5. Cuando confirmen que terminaron, responde EXACTAMENTE con este formato (IMPORTANTE: usa exactamente estos delimitadores, no uses otros como ======= o *******):

---RESUMEN---
aboutMe: [resumen conciso de la persona en tercera persona]
aboutThem: [resumen conciso de lo que buscan en tercera persona]
---FIN---

IMPORTANTE: Cuando generes el resumen, usa EXACTAMENTE "---RESUMEN---" al inicio y "---FIN---" al final. No uses otros formatos como "========" o "********".

## Reglas
- Siempre en español
- Se breve y conversacional, no mandes parrafos largos
- No seas un interrogatorio, haz que fluya natural
- Respeta todas las orientaciones y preferencias
- No generes codigo ni hagas nada fuera de tu mision
- Los resumenes deben ser concisos pero informativos (2-4 oraciones cada uno)

## Ejemplo de resumenes:
aboutMe: "Hector es alto, de tez clara, estudia robotica. Le apasionan los videojuegos de accion y horror, la programacion y el anime. Es introvertido pero disfruta salir con amigos cercanos. Le gusta el gym y la comida japonesa."
aboutThem: "Busca a alguien que le gusten los videojuegos, que sea tranquila pero divertida. Prefiere chicas de estatura media, que les guste el anime y sean cariñosas. No le importa la carrera pero valora que sean inteligentes y curiosas."
`;

const GREETING = "¡Hola! Soy RoBoCupido 💘 Estoy aqui para conocerte y ayudarte a encontrar a tu match ideal. Cuentame, ¿como te describirias? Puedes empezar por lo que quieras: tu personalidad, que estudias, tus hobbies...";

export const llmRouter = createTRPCRouter({
  chat: protectedProcedure
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
    .mutation(async ({ ctx, input }) => {
      const langchainMessages = [
        new SystemMessage(SYSTEM_PROMPT),
        ...input.messages.map((msg) =>
          msg.role === "user"
            ? new HumanMessage(msg.content)
            : new AIMessage(msg.content),
        ),
      ];

      const response = await model.invoke(langchainMessages);
      const content = response.content as string;

      // Check if the LLM returned the summary - handle various formats the LLM might use
      // Primary format: ---RESUMEN--- ... ---FIN---
      // Also handles: ======= or ******* or similar delimiters
      const summaryMatch =
        /(?:---RESUMEN---|={3,}|[*]{3,}|\[RESUMEN\]|RESUMEN:?)\s*\n?\s*aboutMe:\s*"?([^"]*?)"?\s*\n\s*aboutThem:\s*"?([^"]*?)"?\s*\n?\s*(?:---FIN---|={3,}|[*]{3,}|\[FIN\]|FIN)?/si.exec(
          content,
        );
      
      // Fallback: try to extract if we see aboutMe and aboutThem patterns without delimiters
      const fallbackMatch = !summaryMatch ? 
        /aboutMe:\s*"?(.+?)"?\s*\n\s*aboutThem:\s*"?(.+?)"?\s*(?:\n|$)/si.exec(content) : null;

      const finalMatch = summaryMatch ?? fallbackMatch;

      if (finalMatch) {
        const aboutMe = finalMatch[1]!.trim();
        const aboutThem = finalMatch[2]!.trim();

        const [aboutMeEmbedding, aboutThemEmbedding] = await Promise.all([
          embeddings.embedQuery(aboutMe),
          embeddings.embedQuery(aboutThem),
        ]);

        const aboutMeVector = `[${aboutMeEmbedding.join(",")}]`;
        const aboutThemVector = `[${aboutThemEmbedding.join(",")}]`;

        // Generate a personalized profile description using the LLM
        const profileDescriptionPrompt = `Basándote en la siguiente información sobre una persona, genera una descripción atractiva y amigable de su perfil en 2-3 oraciones. Hazlo en segunda persona ("Eres...") para que se sienta personal. Mantén un tono positivo y resalta sus mejores cualidades.

Información de la persona:
${aboutMe}

Genera solo la descripción, sin explicaciones adicionales.`;

        const profileResponse = await model.invoke([
          new SystemMessage("Eres un asistente que crea descripciones de perfil atractivas y positivas en español."),
          new HumanMessage(profileDescriptionPrompt),
        ]);
        const profileDescription = (profileResponse.content as string).trim();

        await ctx.db.$executeRaw`
          UPDATE "User"
          SET "aboutMe" = ${aboutMe},
              "aboutThem" = ${aboutThem},
              "aboutMeEmbedding" = ${aboutMeVector}::vector,
              "aboutThemEmbedding" = ${aboutThemVector}::vector,
              "profileDescription" = ${profileDescription}
          WHERE id = ${ctx.session.user.id}
        `;

        return {
          content:
            "¡Gracias por compartir todo esto conmigo! Ya tengo tu perfil listo. Ahora solo queda esperar al 14 de febrero para ver tus matches. ¡Mucha suerte! 💘",
          done: true,
          profileDescription,
        };
      }

      return { content, done: false };
    }),

  greeting: protectedProcedure.query(() => {
    return { content: GREETING };
  }),
});

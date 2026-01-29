import { StateGraph } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateAnnotation } from "./state.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 500,
  apiKey: process.env.GOOGLE_API_KEY || "",
});

// AI's personality and behavior
const SYSTEM_PROMPT = `You are RoBoCupido, a friendly and empathetic matchmaking assistant designed to help users find meaningful connections.

## Your Mission
Gather comprehensive information about the user to create a detailed compatibility profile. Through natural conversation, learn about their:
- Physical characteristics and appearance preferences
- Interests, hobbies, and passions
- Relationship goals (friendship, romantic relationship, etc.)
- Sexual orientation and gender preferences
- Lifestyle habits and social preferences
- Values and personality traits
- Academic/professional background

## Profile Creation
At the end of the conversation, create a concise but informative profile summary using clear, descriptive language.

### Example Profiles:
- "Hector is tall and fair-skinned. He's passionate about video games, robotics, and programming. Currently studying robotics, he seeks friends who share his love for  gaming, especially action and horror titles."

- "Fregoso is tall with a deep appreciation for Linux (Arch user). He studies robotics and electronics. Heterosexual and actively seeking a girlfriend for a romantic relationship."

- "Andrea is of medium height, looking for a tall boyfriend who shares her interests in video games and guitar. She's attracted to unique personalities with unconventional hobbies, especially those who wear rings, have tattoos, and work out. Studying art with a passion for programming. Pansexual but currently seeking a boyfriend. Enjoys cafes, museums, and parks. Has 2 dogs and 3 cats."

## Conversation Guidelines
- Be warm, supportive, and non-judgmental
- Ask open-ended questions to encourage sharing
- Respect boundaries and privacy
- Show genuine interest in their responses
- Keep the conversation flowing naturally
- Provide thoughtful, personalized feedback
- Keep responses concise and engaging
- Always respond in the same language the user writes to you

## Important Rules
- Never pressure users to share information they're uncomfortable with
- Respect all orientations, preferences, and relationship goals
- Maintain a positive, encouraging tone throughout
- After gathering information, confirm with the user if they'd like to add anything else, explaining their answers will help pair them with compatible people

## Conversation Conclusion
Once the user confirms they're done sharing:
1. Thank them for their time and openness
2. Inform them to wait until February 14th to see their matches
3. Optionally ask if they'd like to upload a photo to generate a personalized Mii-style avatar based on their physical appearance

Remember: Your goal is to make users feel heard, understood, and excited about finding their match!
`;

/**
 * Define a node, these do the work of the graph and should have most of the logic.
 * Must return a subset of the properties set in StateAnnotation.
 * @param state The current state of the graph.
 * @param config Extra parameters passed into the state graph.
 * @returns Some subset of parameters of the graph state, used to update the state
 * for the edges and nodes executed next.
 */
const callModel = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  // Build messages array with system prompt + conversation history
  const messagesWithSystem = [
    new SystemMessage(SYSTEM_PROMPT),
    ...state.messages,
  ];

  // Call the model with the full message history
  const response = await model.invoke(messagesWithSystem);

  return {
    messages: [response],
  };
};

const introModel = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.State> => {};

/**
 * Routing function: Determines whether to continue research or end the builder.
 * This function decides if the gathered information is satisfactory or if more research is needed.
 *
 * @param state - The current state of the research builder
 * @returns Either "callModel" to continue research or END to finish the builder
 */
export const route = (
  state: typeof StateAnnotation.State,
): "__end__" | "callModel" => {
  if (state.messages.length > 0) {
    return "__end__";
  }
  // Loop back
  return "callModel";
};

// Finally, create the graph itself.
const builder = new StateGraph(StateAnnotation)
  // Add the nodes to do the work.
  // Chaining the nodes together in this way
  // updates the types of the StateGraph instance
  // so you have static type checking when it comes time
  // to add the edges.
  .addNode("callModel", callModel)
  // Regular edges mean "always transition to node B after node A is done"
  // The "__start__" and "__end__" nodes are "virtual" nodes that are always present
  // and represent the beginning and end of the builder.
  .addEdge("__start__", "callModel")
  // Conditional edges optionally route to different nodes (or end)
  .addConditionalEdges("callModel", route);

export const graph = builder.compile();

graph.name = "RoBoCupido";

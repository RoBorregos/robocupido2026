import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import {
  AIMessage,
  HumanMessage,
  ToolMessage,
  SystemMessage,
} from "@langchain/core/messages";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";
import { z } from "zod";

// Model setup
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0.7,
});

// Example of tools
const add = tool(({ a, b }) => (a + b).toString(), {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const tools = [add];
const toolsByName = Object.fromEntries(tools.map((t) => [t.name, t]));
const modelWithTools = model.bindTools(tools);

async function llmCall(state: typeof MessagesAnnotation.State) {
  const response = await modelWithTools.invoke([
    new SystemMessage(
      "You are a helpful assistant tasked with performing arithmetic on a set of inputs.",
    ),
    ...state.messages,
  ]);
  return { messages: [response] };
}

async function toolNode(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages.at(-1);

  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] };
  }

  const results: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const selectedTool = toolsByName[toolCall.name];
    if (selectedTool) {
      const observation = await selectedTool.invoke(toolCall);
      results.push(observation);
    }
  }

  return { messages: results };
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages.at(-1);

  if (AIMessage.isInstance(lastMessage) && lastMessage.tool_calls?.length) {
    return "toolNode";
  }
  return END;
}

const agent = new StateGraph(MessagesAnnotation)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall")
  .compile();

export { agent, HumanMessage };

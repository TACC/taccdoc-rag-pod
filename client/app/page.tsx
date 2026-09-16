import { AgentChat } from "./agent-chat";

export const dynamic = "force-dynamic";

export default function Home() {
  const agentId = process.env.COPILOTKIT_AGENT_ID ?? "my_agent";
  const welcomeMessage =
    process.env.CHATBOT_WELCOME_MESSAGE ??
    "Welcome to the TACC Documentation RAG (Beta). How can I help?";

  return <AgentChat agentId={agentId} welcomeMessage={welcomeMessage} />;
}

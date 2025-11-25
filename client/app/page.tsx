import "@copilotkit/react-ui/styles.css";
import { CopilotChat } from "@copilotkit/react-ui";

export function AgentApp() {
  return (
    <main>
      <CopilotChat
        labels={{
          title: "Popup Assistant",
          initial:
            "Welcome to the beta TACC Documentation RAG. How can I help?",
        }}
      />
    </main>
  );
}

export default function Home() {
  return (
    <div className="m-5">
      <AgentApp />
    </div>
  );
}
